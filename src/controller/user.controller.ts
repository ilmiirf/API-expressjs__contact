import type { Request, Response, NextFunction } from "express";
import userService from "../service/user.service";
import { RequestUser } from "../types/userTypes";
const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.register(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req: RequestUser, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const result = await userService.getUser(user);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const request = req.body;
    request.username = user?.username;
    // res.json({ request: request });

    const result = await userService.updateUser(request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: RequestUser, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    await userService.logout(user);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getUser,
  updateUser,
  logout,
};
