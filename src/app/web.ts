import express from "express";
import publicRouter from "../route/publicApi";
import { errorMiddleare } from "../middleware/error.middleware";
import privateRouter from "../route/privateApi";

export const app = express();

app.use(express.json());
app.use(publicRouter);
app.use(privateRouter);
app.use(errorMiddleare);
