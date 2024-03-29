import { ResponseError } from "../error/response.error";
import type { Request, Response, NextFunction } from "express";
const errorMiddleare = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    next();
    return;
  }
  if (err instanceof ResponseError) {
    res.status(err.code).json({ errors: err.message }).end();
  } else {
    res.status(500).json({ errors: err.message }).end();
  }
};

export { errorMiddleare };
