import { NextFunction, Response, Router } from "express";
import { IController } from "../interfaces/controller.interface";
import { PostService } from "../services/posts.service";
import { auth } from "../middlewares/auth.middleware";
import { checkUser } from "../middlewares/checkUser.middleware";
import { ReqWithUser } from "src/types/reqWithUser.type";

export class PostsController implements IController {
  router: Router = Router();

  constructor(private readonly postsService: PostService) {}

  async create() {
    this.router.post(
      "/posts",
      auth,
      checkUser,
      async (req: ReqWithUser, res: Response, next: NextFunction) => {
        try {
          await this.postsService.create(req, res);
        } catch (e) {
          next(e);
        }
      }
    );
  }

  update() {
    this.router.patch(
      "/posts/:postId",
      auth,
      checkUser,
      async (req: ReqWithUser, res: Response, next: NextFunction) => {
        try {
          await this.postsService.update(req, res);
        } catch (e) {
          next(e);
        }
      }
    );
  }

  async delete() {
    this.router.delete(
      "/posts/:postId",
      auth,
      checkUser,
      async (req: ReqWithUser, res: Response, next: NextFunction) => {
        try {
          await this.postsService.delete(req, res);
        } catch (e) {
          next(e);
        }
      }
    );
  }

  findMany() {
    this.router.get(
      "/posts",
      auth,
      async (req: ReqWithUser, res: Response, next: NextFunction) => {
        try {
          await this.postsService.findMany(req, res);
        } catch (e) {
          next(e);
        }
      }
    );
  }

  getRouter(): Router {
    this.create();
    this.update();
    this.delete();
    this.findMany();

    return this.router;
  }
}
