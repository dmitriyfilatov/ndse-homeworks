import { Router } from "express";
import { CountersService } from "../../counters/counters.service";
import container from "../../infrastructure/container";
const router = Router();

router.get(":id", async (req, res) => {
  const { id } = req.params;
  const service = container.get(CountersService);
  const counter = await service.findById(id);
  res.json(counter);
});

router.post("", async (req, res) => {
  const service = container.get(CountersService);
  const counter = await service.create(req.body);
  res.json(counter);
});

module.exports = router;
