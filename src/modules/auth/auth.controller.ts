import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/entities/user.entity';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResponseData } from 'src/common/globalClass';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    try {
      const user = await this.userService.createUser(userData);
      if (!user) throw new Error('User not found');
      const phone = await this.userService.findByPhone(user.id);
      console.log({ phone });

      return { message: 'User registered successfully', user };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request & { user: User }, @Res() res: Response) {
    const result = await this.authService.login(req.user);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json(
      new ResponseData(result, HttpStatus.CREATED, 'Login successful'),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: User }) {
    return req.user;
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'] as string;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    try {
      const user = await this.authService.verifyRefreshToken(refreshToken);

      if (!user) throw new Error('Invalid refresh token');

      const accessToken = this.authService.refreshToken(user);

      return accessToken;
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Invalid refresh token',
      );
    }
  }
}
