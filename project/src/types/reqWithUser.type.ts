import { Request } from "express";

export type ReqWithUser = Request & {
  user?: any;
};
