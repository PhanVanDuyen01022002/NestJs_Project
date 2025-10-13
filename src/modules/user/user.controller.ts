import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ResponseData } from 'src/common/globalClass';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser() {
    const users = await this.userService.findAll();
    return new ResponseData<User[]>(users);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      return user;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  removeUser(@Param('id') id: number): string {
    return 'Xoa user thanh cong' + id;
  }

  @Post()
  async createUser(@Body() body: User): Promise<ResponseData<User | null>> {
    if (!body.name || !body.email || !body.password) {
      throw new HttpException(
        new ResponseData<null>(null, HttpStatus.BAD_REQUEST, 'Invalid data'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.create(body);
    return new ResponseData<User>(user);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: CreateUserDto) {
    try {
      const user = await this.userService.update(id, body);
      console.log({ user });

      return user;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
