import { Request, Response, Router } from "express";
import { IController } from "src/interfaces/controller.interface";
import { refreshingTokens } from "../middlewares/auth.middlewares";
import { jwtService } from "../services/jwt.service";
import { UsersService } from "../services/users.service";

export class UsersController implements IController {
  router: Router = Router();

  constructor(private readonly usersService: UsersService) {}

  private async register() {
    this.router.post(
      "/auth/register",
      async ({ body }: Request, res: Response) => {
        try {
          const resData = await this.usersService.register(body);
          return res.json(resData);
        } catch (error) {
          return res.json(error);
        }
      }
    );
  }

  private async login() {
    this.router.post(
      "/auth/login",
      async ({ body }: Request, res: Response) => {
        const userId = await this.usersService.login(body);

        return res.json(jwtService.generateTokens(userId));
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
