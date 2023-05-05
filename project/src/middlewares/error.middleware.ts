import { Response } from "express";

export const errorHandling = (error, _, res: Response, _1) => {
  if (error) {
    console.log(error);

    const status = error?.status ?? 500;
    const errResp = error?.message ? error : "Unhandling exception";

    res.status(status).json(errResp);
  }
};
