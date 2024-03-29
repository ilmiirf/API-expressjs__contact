import { Request } from "express";
import { validate } from "../validation/validation";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user.validation";
import { prisma } from "../app/database";
import { ResponseError } from "../error/response.error";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (req: Request) => {
  const user = validate(registerUserValidation, req);
  const countUser = await prisma.user.count({
    where: {
      username: user.username,
    },
  });
  if (countUser === 1) {
    throw new ResponseError(400, "username already exists");
  }
  user.password = await bcrypt.hash(user.password, 10);
  const result = await prisma.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
  return result;
};

const login = async (req: Request) => {
  const loginRequest = validate(loginUserValidation, req);

  const user = await prisma.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(400, "username or password wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(400, "username or password wrong");
  }

  const token = uuid().toString();
  const result = await prisma.user.update({
    where: {
      username: user.username,
    },
    data: {
      token,
    },
    select: {
      token: true,
    },
  });
  return result;
};

const getUser = async (req: any) => {
  const requestUser = validate(getUserValidation, req);
  const user = await prisma.user.findUnique({
    where: {
      username: requestUser.username,
    },
    select: {
      username: true,
      name: true,
    },
  });
  if (!user) {
    throw new ResponseError(404, "username not found");
  }
  return user;
};
interface UserType {
  username: string;
  name?: string;
  password?: string;
}
const updateUser = async (req: any) => {
  const requestUser = validate(updateUserValidation, req);
  const totalUser = await prisma.user.count({
    where: {
      username: requestUser.username,
    },
  });
  if (totalUser === 0) {
    throw new ResponseError(404, "username not found");
  }

  if (requestUser.password) {
    const hashedPassword = await bcrypt.hash(requestUser.password, 10);
    requestUser.password = hashedPassword;
  }

  const result = prisma.user.update({
    where: {
      username: requestUser.username,
    },
    data: requestUser,
    select: {
      username: true,
      name: true,
      password: true,
    },
  });

  return result;
};

const logout = async (req: any) => {
  const requestUser = validate(getUserValidation, req);
  const user = await prisma.user.findUnique({
    where: {
      username: requestUser.username,
    },
  });
  if (!user) {
    throw new ResponseError(404, "user not found");
  }
  return await prisma.user.update({
    where: {
      username: requestUser.username,
    },
    data: {
      token: null,
    },
  });
};

export default {
  register,
  login,
  getUser,
  updateUser,
  logout,
};
