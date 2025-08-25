import express from "express";
import { router } from "@routes/routes";
import { corsMiddleware } from "@middlewares/CorsMiddleware";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/api", router);

export { app };
