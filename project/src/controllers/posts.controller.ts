import { NextFunction, Response, Router } from "express";
import { IController } from "../interfaces/controller.interface";
import { PostService } from "../services/posts.service";
import { auth } from "../middlewares/auth.middleware";
import { checkUser } from "../middlewares/checkUser.middleware";
import { ReqWithUser } from "src/types/reqWithUser.type";
import { upload } from "../middlewares/upload.middleware";

export class PostsController implements IController {
  router: Router = Router();

  constructor(private readonly postsService: PostService) {}

  create() {
    this.router.post(
      "/posts",
      auth,
      checkUser,
      upload.single("file"),
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

  delete() {
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

  findAuthUserPosts() {
    this.router.get(
      "/posts",
      auth,
      async (req: ReqWithUser, res: Response, next: NextFunction) => {
        try {
          await this.postsService.findAuthUserPosts(req, res);
        } catch (e) {
          next(e);
        }
      }
    );
  }

  findAllPosts() {
    this.router.get(
      "/posts/all",
      async (req: ReqWithUser, res: Response, next: NextFunction) => {
        try {
          await this.postsService.findAllPosts(req, res);
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
    this.findAuthUserPosts();
    this.findAllPosts();

    return this.router;
  }
}
