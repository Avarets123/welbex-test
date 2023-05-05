import * as express from "express";
import { App } from "./src/app";
import { UsersController } from "./src/controllers/users.controller";
import { UsersService } from "./src/services/users.service";
import * as cors from "cors";
import { PostService } from "./src/services/posts.service";
import { PostsController } from "./src/controllers/posts.controller";
import { errorHandling } from "./src/middlewares/error.middleware";
import { PrismaClient } from "@prisma/client";
import { jwtService } from "./src/services/jwt.service";

const app = new App(express());

const prisma = new PrismaClient();

export const usersService = new UsersService(prisma, jwtService);
const postsService = new PostService(prisma);

const usersController = new UsersController(usersService);
const postsController = new PostsController(postsService);

app.addMiddleware(express.urlencoded({ extended: false }));
app.addMiddleware(express.json());
app.addMiddleware(cors());

app.addRouter(usersController);
app.addRouter(postsController);

app.addMiddleware(errorHandling);

app.start();

console.log("working........");
