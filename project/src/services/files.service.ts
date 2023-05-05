import { Files, Prisma, PrismaClient } from "@prisma/client";

export class FilesService {
  constructor(private readonly prisma: PrismaClient) {}

  create(postId: string, userId: string, fileData) {
    const data = {
      postId,
      creatorId: userId,
      ...fileData,
    };

    return async (prisma?: Prisma.TransactionClient) => {
      await (prisma ?? this.prisma).files.create({
        data,
      });
    };
  }

  async changePostFile(postId: string, fileData: Files) {
    const data = { postId, ...fileData };

    await this.prisma.posts.update(this.getUpdateData(postId, data));

    return async (prisma: Prisma.TransactionClient) => {
      await prisma.posts.update(this.getUpdateData(postId, data));
    };
  }

  private getUpdateData(postId: string, data: Files & { postId: string }) {
    return {
      where: {
        id: postId,
      },
      data: { files: { deleteMany: {}, create: data } },
    };
  }
}
