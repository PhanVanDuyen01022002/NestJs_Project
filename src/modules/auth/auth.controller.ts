import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
// import { UserLoginDto } from './dto/user-login';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from 'src/entities/User';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    // private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    try {
      const user = await this.userService.create(userData);
      return { message: 'User registered successfully', user };
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);

        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request & { user: User }) {
    console.log(req.user);
    return req.user;

    // try {
    //   if (!loginData.email.trim() || !loginData.password.trim()) {
    //     throw new Error('Email and password are required');
    //   }
    //   const user = await this.userService.validateUser(
    //     loginData.email,
    //     loginData.password,
    //   );

    //   return { message: 'Login successful', user };
    // } catch (error) {
    //   throw new HttpException(
    //     error instanceof Error ? error.message : 'Login failed',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
  }
}
