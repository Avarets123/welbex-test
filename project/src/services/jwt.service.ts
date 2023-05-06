import { sign, verify } from "jsonwebtoken";

export class JwtService {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET ?? "anything";
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET ?? "any";

  generateTokens(userId: string) {
    const accessToken = sign({ sub: userId }, this.accessSecret, {
      expiresIn: "1d",
    });

    const refreshToken = sign({ sub: userId }, this.refreshSecret, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  verifyAccessToken(token: string) {
    return verify(token, this.accessSecret);
  }

  verifyRefreshToken(token: string) {
    return verify(token, this.refreshSecret);
  }
}

export const jwtService = new JwtService();
