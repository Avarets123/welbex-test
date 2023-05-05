import { PrismaClient } from "@prisma/client";
import { UserDto } from "../dto/users/user.dto";
import { compare, hash } from "bcrypt";
import { UserNotFoundException } from "../exceptions/userNotFound.exception";
import { InvalidPasswordException } from "../exceptions/invalidPassword.exception";
import { UserExistsException } from "../exceptions/userExists.exception";

export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(data: UserDto) {
    const { password, email } = data;

    // const hasUser = await this.findUserByEmail(email).then(() => {
    //   throw new Error("Пользователь уже зарегистрирован");
    // });

    data.password = await this.hashingPassword(password);

    return this.prisma.users.create({
      data,
    });
  }

  async login(data: Omit<UserDto, "name">) {
    const { email, password } = data;

    const hasUser = await this.findUserByEmail(email).catch(() => {
      throw new UserNotFoundException();
    });

    const isValidPassword = await compare(password, hasUser.password);

    if (!isValidPassword) {
      throw new InvalidPasswordException();
    }

    return hasUser.id;
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
