import { Files, Posts, PrismaClient } from "@prisma/client";
import { Response } from "express";
import { ReqWithUser } from "../types/reqWithUser.type";
import { YourPostNotFound } from "../exceptions/postNotFound.exception";
import { FilesService } from "./files.service";

export class PostService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly filesService: FilesService
  ) {}

  async create({ body, user, file }: ReqWithUser, res: Response) {
    const userId = user.sub;

    this.prisma.$transaction(async (prisma) => {
      const post = await prisma.posts.create({
        data: {
          ...body,
          authorId: userId,
        },
      });

      if (file) {
        const { filename, originalname, mimetype, size } = file;

        const fileData = {
          finalName: filename,
          originalName: originalname,
          mimeType: mimetype,
          size,
        };

        // Метод можно вызвать с транзакцией и без
        // Если при втором вызове передан аргумент призмы, то метод будет выполнен внутри текущей транзакции,
        // а если не передать ничего будет выполнен за транзакцией
        // await this.filesService.create(post.id, user.sub, fileData)();
        await this.filesService.create(post.id, user.sub, fileData)(prisma);
      }
    });
    res.status(201).json("Post has been created");
  }

  async update({ params, body, user }: ReqWithUser, res: Response) {
    await this.findPostByAuthorId(params.postId, user.sub);

    await this.prisma.posts.update({
      where: {
        id: params.postId,
      },
      data: body,
    });

    res.status(204).json("Post has been updated");
  }

  async delete({ params, user }: ReqWithUser, res: Response) {
    await this.findPostByAuthorId(params.postId, user.sub);
    await this.prisma.posts.delete({ where: { id: params.postId } });
    res.status(204).json("Post has been deleted");
  }

  async findAuthUserPosts({ user, query }: ReqWithUser, res: Response) {
    const page: any = query.page ? Number(query.page) : 1;

    const resData = await this.findPostsByWhere({ authorId: user.sub }, page);

    res.status(200).json(resData);
  }

  async findAllPosts({ query }: ReqWithUser, res: Response) {
    const page: any = query.page ?? 1;

    const resData = await this.findPostsByWhere({}, page);

    res.status(200).json(resData);
  }

  private async findPostsByWhere(where: Partial<Posts>, page: number) {
    const posts = this.prisma.posts.findMany({
      where,
      include: { files: true },
      take: page * 20,
      skip: (page <= 1 ? 0 : page - 1) * 20,
    });

    const countPosts = this.prisma.posts.count({
      where,
    });

    const [data, count] = await Promise.all([posts, countPosts]);

    const mappedData = data.map(this.mapSizeToNumber);

    return { limit: 20, page, count, data: mappedData };
  }

  private async findPostByAuthorId(postId: string, authorId: string) {
    this.prisma.posts
      .findFirstOrThrow({
        where: {
          id: postId,
          authorId,
        },
      })
      .catch(() => {
        throw YourPostNotFound;
      });
  }

  private mapSizeToNumber<T extends { files: any }>(data: T) {
    const { files } = data;

    return {
      ...data,
      files: files.map((el: Partial<Files>) => ({
        ...el,
        size: Number(el.size),
      })),
    };
  }
}
