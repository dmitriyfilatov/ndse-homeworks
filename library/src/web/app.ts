import "reflect-metadata";

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

const booksRouter = require("./routes/books.routes");
const countersRouter = require("./routes/counters.routers");

require("../infrastructure/container");
require("../infrastructure/db_connnection");

const app = express();
app.use(express.json);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/books", booksRouter);
app.use("/api/counters", countersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server running on http://localhost:${PORT}`);
});
