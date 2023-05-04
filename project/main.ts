import { PrismaClient } from "@prisma/client";
import express from "express";
import { App } from "src/app";
import { UsersController } from "src/controllers/users.controller";
import { UsersService } from "src/services/users.service";

const prisma = new PrismaClient();
const app = new App(express());

const usersController = new UsersController(new UsersService(prisma));

app.addRouter(usersController);

app.start();

console.log("working........");
