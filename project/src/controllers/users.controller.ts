import { NextFunction, Request, Response, Router } from "express";
import { IController } from "src/interfaces/controller.interface";
import { refreshingTokens } from "../middlewares/refreshTokens.middleware";
import { jwtService } from "../services/jwt.service";
import { UsersService } from "../services/users.service";

export class UsersController implements IController {
  router: Router = Router();

  constructor(private readonly usersService: UsersService) {}

  private async register() {
    this.router.post(
      "/auth/register",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
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
      async (req: Request, res: Response, next: NextFunction) => {
        try {
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
