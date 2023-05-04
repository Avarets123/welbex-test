import { PrismaClient } from "@prisma/client";
import { UserDto } from "src/dto/users/user.dto";
import { compare, hash } from "bcrypt";
import { UserNotFoundException } from "src/exceptions/userNotFound.exception";
import { InvalidPasswordException } from "src/exceptions/invalidPassword.exception";

export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  async register(data: UserDto) {
    const { password } = data;

    data.password = await this.hashingPassword(password);

    return this.prisma.users.create({
      data,
    });
  }

  async login(data: Omit<UserDto, "name">) {
    const { email, password } = data;

    const hasUser = await this.findUserByEmail(email);

    const isValidPassword = await compare(password, hasUser.password);

    if (!isValidPassword) {
      throw new InvalidPasswordException();
    }

    return hasUser;
  }

  async findUserByEmail(email: string) {
    return this.prisma.users
      .findFirstOrThrow({
        where: { email },
      })
      .catch(() => {
        throw new UserNotFoundException();
      });
  }

  private async hashingPassword(password: string, difficult = 9) {
    return hash(password, difficult);
  }
}
