import express from "express";
import cors from "cors";
import { router } from "@routes/routes";

const app = express();

app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: false,
    maxAge: 86400,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use("/api", router);

export { app };
