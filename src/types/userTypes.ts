import { Request } from "express";

export interface UserType {
  username: string;
  password?: string;
  name: string;
  token?: string | null;
}
export interface RequestUser extends Request {
  user?: UserType;
}
