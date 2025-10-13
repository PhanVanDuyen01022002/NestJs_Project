import { Controller, Get } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userSevice: UserService) {
    console.log('AuthController created');
  }

  @Get('login')
  login(): string {
    return 'Login success';
  }
}
