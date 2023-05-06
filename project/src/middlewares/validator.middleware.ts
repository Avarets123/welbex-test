import { Request, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";

export const emailAndPasswordValidation: ValidationChain[] = [
  body("email", "Введите корректный емайл").isEmail().isLength({ min: 3 }),
  body("password", "Введите корректный пароль").isString().isLength({ min: 3 }),
];

export const postCreateValidation: ValidationChain[] = [
  body("content", "Введите корректный текст").isString().isLength({ min: 3 }),
];

export const handlingValidationError = (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
};
