import { CounterModel } from "./counters.model";
import { Counter } from "./counter";

interface CreateCounterDto {
  bookId: Counter["bookId"];
  value: Counter["value"];
}

export class CountersService {
  constructor() {}
  async create(data: CreateCounterDto): Promise<Counter> {
    const counter = new CounterModel(data);
    await counter.save();
    return counter;
  }
  findById(id: string): Promise<Counter> {
    return CounterModel.findById(id).exec();
  }
}
