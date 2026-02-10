import express from "express";
import cors from "cors";
import morgan from "morgan";

import router from "./routes/health.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);

app.get("/", (_req, res) => {
  res.send("AgroShare API is running");
});

app.use(errorHandler);

export default app;
