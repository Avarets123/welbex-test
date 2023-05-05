import { usersService } from "../../main";
import { jwtService } from "../services/jwt.service";
import { ReqWithUser } from "../types/reqWithUser.type";
import { Response } from "express";

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
