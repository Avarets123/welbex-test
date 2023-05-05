import { Response, Router } from "express";
import { IController } from "../interfaces/controller.interface";
import { PostService } from "../services/posts.service";
import { authMidd, checkUserMidd } from "../middlewares/auth.middlewares";
import { ReqWithUser } from "src/types/reqWithUser.type";

export class PostsController implements IController {
  router: Router = Router();

  constructor(private readonly postsService: PostService) {}

  async create() {
    this.router.post(
      "/posts",
      authMidd,
      checkUserMidd,
      async (req: ReqWithUser, res: Response) => {
        try {
          await this.postsService.create(req, res);
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  update() {
    this.router.patch(
      "/posts/:postId",
      authMidd,
      checkUserMidd,
      async (req: ReqWithUser, res: Response) => {
        try {
          await this.postsService.update(req, res);
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  async delete() {
    this.router.delete(
      "/posts/:postId",
      authMidd,
      checkUserMidd,
      async (req: ReqWithUser, res: Response) => {
        try {
          await this.postsService.delete(req, res);
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  findMany() {
    this.router.get(
      "/posts",
      authMidd,
      async (req: ReqWithUser, res: Response) => {
        try {
          await this.postsService.findMany(req, res);
        } catch (e) {
          console.log(e);
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
