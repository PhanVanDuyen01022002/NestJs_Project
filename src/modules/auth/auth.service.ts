import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { JwtPayload } from 'src/types/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
    } as JwtSignOptions);

    await this.userService.saveRefreshToken(user.id, refreshToken);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async verifyRefreshToken(refreshToken: string) {
    const decoded: JwtPayload = this.jwtService.decode(refreshToken);

    if (decoded) {
      return this.userService.verifyRefreshToken(refreshToken, decoded.sub);
    }

    return false;
  }

  refreshToken(user: User) {
    const payload = { username: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
