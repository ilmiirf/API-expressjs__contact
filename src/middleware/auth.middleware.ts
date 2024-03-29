import { NextFunction, Request, Response } from "express";
import { prisma } from "../app/database";
import { logger } from "../app/logging";
import { RequestUser } from "../types/userTypes";

export const authMiddleware = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  // const token = req.get("Authorization");

  const token = authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      errors: "Unauthorized",
    });
    return;
  } else {
    const user = await prisma.user.findFirst({
      where: {
        token: token,
      },
      select: {
        username: true,
        name: true,
      },
    });

    if (!user) {
      res.status(401).json({
        errors: "Unauthorized User",
        token: token,
      });
      return;
    }
    req.user = user;
    next();
  }
};
