import { Request, Response, Router } from "express";
import { UserDto } from "src/dto/users/user.dto";
import { IController } from "src/interfaces/controller.interface";
import { UsersService } from "src/services/users.service";

export class UsersController implements IController {
  router: Router = Router();

  constructor(private readonly usersService: UsersService) {}

  private async register() {
    this.router.post(
      "/auth/register",
      async ({ body }: Request, res: Response) => {
        const resData = await this.usersService.register(body);
        return res.json(resData);
      }
    );
  }

  private async login() {
    this.router.post(
      "/auth/login",
      async ({ body }: Request, res: Response) => {
        const resData = await this.usersService.login(body);

        return res.json(resData);
      }
    );
  }

  getRouter(): Router {
    this.register();
    this.login();

    return this.router;
  }
}
