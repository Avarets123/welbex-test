import { sign, verify } from "jsonwebtoken";

export class JwtService {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET ?? "anything";
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET ?? "anything";

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
    try {
      return verify(token, this.accessSecret);
    } catch (e) {
      console.log(e);
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return verify(token, this.refreshSecret);
    } catch (e) {
      console.log(e);
    }
  }
}

export const jwtService = new JwtService();
