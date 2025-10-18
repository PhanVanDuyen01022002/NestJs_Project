import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { ResponseData } from 'src/common/globalClass';
import { UpdateUserDto } from './dto/update-user.dto';

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
    } catch {
      throw new NotFoundException('User Not Found!');
    }
  }

  @Get(':id/posts')
  async getPostsUser(@Param('id') id: string) {
    try {
      const user = await this.userService.findPostsByUserId(id);
      return user;
    } catch {
      throw new NotFoundException('User Not Found!');
    }
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    try {
      const user = await this.userService.remove(id);
      return user;
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    try {
      const user = await this.userService.updateUser(id, body);

      return user;
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);
    }
  }
}
