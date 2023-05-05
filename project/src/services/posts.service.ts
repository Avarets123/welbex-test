import { PrismaClient } from "@prisma/client";
import { PostDto } from "../dto/posts/post.dto";
import { Request, Response } from "express";
import { ReqWithUser } from "../types/reqWithUser.type";
import { YourPostNotFound } from "../exceptions/postNotFound.exception";

export class PostService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(req: ReqWithUser, res: Response) {
    const userId = req.user.sub;

    const data: PostDto = req.body;

    await this.prisma.posts.create({
      data: {
        ...data,
        authorId: userId,
      },
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

  async findMany({ user, query }: ReqWithUser, res: Response) {
    const page: any = query.page ?? 1;

    const posts = this.prisma.posts.findMany({
      where: {
        authorId: user.sub,
      },
      take: page * 20,
      skip: (page <= 1 ? 0 : page - 1) * 20,
    });

    const countPosts = this.prisma.posts.count({
      where: { authorId: user.sub },
    });

    const [data, count] = await Promise.all([posts, countPosts]);

    const resData = { limit: 20, page, count, data };

    res.status(200).json(resData);
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
}
