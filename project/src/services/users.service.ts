import { PrismaClient } from "@prisma/client";
import { UserDto } from "../dto/users/user.dto";
import { compare, hash } from "bcrypt";
import { UserNotFoundException } from "../exceptions/userNotFound.exception";
import { InvalidPasswordException } from "../exceptions/invalidPassword.exception";
import { UserExistsException } from "../exceptions/userExists.exception";
import { ReqWithUser } from "src/types/reqWithUser.type";
import { Response } from "express";
import { JwtService } from "./jwt.service";

export class UsersService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService
  ) {}

  async register({ body }: ReqWithUser, res: Response) {
    const { password, email, name } = body;

    const hasUser = await this.findUserByEmail(email);

    if (hasUser) {
      throw UserExistsException;
    }

    const hashPassword = await this.hashingPassword(password);

    const data = { password: hashPassword, email, name };

    const newData = await this.prisma.users.create({
      data,
    });

    res.status(201).json(newData);
  }

  async login({ body }: ReqWithUser, res: Response) {
    const { email, password }: Omit<UserDto, "name"> = body;

    const hasUser = await this.findUserByEmail(email);

    if (!hasUser) {
      throw UserNotFoundException;
    }

    const isValidPassword = await compare(password, hasUser.password);

    if (!isValidPassword) {
      throw InvalidPasswordException;
    }

    const tokens = this.jwtService.generateTokens(hasUser.id);

    res.status(200).json(tokens);
  }

  async findUserByEmail(email: string) {
    return this.prisma.users.findFirst({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return this.prisma.users.findFirst({
      where: { id },
    });
  }

  private async hashingPassword(password: string, difficult = 9) {
    return hash(password, difficult);
  }
}
