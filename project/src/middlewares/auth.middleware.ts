import { NextFunction, Response } from "express";
import { jwtService } from "../services/jwt.service";
import { ReqWithUser } from "../types/reqWithUser.type";

export const auth = (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization.split(" ");

    if (authorization[0] !== "Bearer") {
      throw new Error("Invalid authorization type");
    }

    const user = jwtService.verifyAccessToken(authorization[1]);

    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(403).json("Unauthorized");
  }
};
