import { NextFunction, Response } from "express";
import { jwtService } from "../services/jwt.service";
import { ReqWithUser } from "../types/reqWithUser.type";
import { usersService } from "../../main";

export const authMidd = (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
) => {
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

export const checkUserMidd = async (
  req: ReqWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const userFromDb = await usersService.findUserById(user.sub);

    if (!userFromDb) {
      res.status(403).json("Unauthorized");
    }

    next();
  } catch (e) {
    console.log(e);
    res.status(403).json("Unauthorized");
  }
};

export const refreshingTokens = async (req: ReqWithUser, res: Response) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const userId = jwtService.verifyRefreshToken(token).sub as string;

    const userFromDb = await usersService.findUserById(userId);

    const tokes = jwtService.generateTokens(userFromDb.id);

    res.json(tokes);
  } catch (error) {
    console.log(error);
    res.status(403).json("Unauthorized");
  }
};
