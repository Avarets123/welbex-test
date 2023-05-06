import { NextFunction, Request, Response, Router } from "express";
import { IController } from "src/interfaces/controller.interface";
import { refreshingTokens } from "../middlewares/refreshTokens.middleware";
import { UsersService } from "../services/users.service";
import {
  emailAndPasswordValidation,
  handlingValidationError,
} from "../middlewares/validator.middleware";

export class UsersController implements IController {
  router: Router = Router();

  constructor(private readonly usersService: UsersService) {}

  private async register() {
    this.router.post(
      "/auth/register",
      emailAndPasswordValidation,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          handlingValidationError(req, res);
          await this.usersService.register(req, res);
        } catch (error) {
          next(error);
        }
      }
    );
  }

  private async login() {
    this.router.post(
      "/auth/login",
      emailAndPasswordValidation,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          handlingValidationError(req, res);
          await this.usersService.login(req, res);
        } catch (error) {
          next(error);
        }
      }
    );
  }

  private async refreshTokens() {
    this.router.post("/auth/refresh-token", refreshingTokens);
  }

  getRouter(): Router {
    this.register();
    this.login();
    this.refreshTokens();

    return this.router;
  }
}
