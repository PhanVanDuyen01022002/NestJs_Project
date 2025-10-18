import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    try {
      return await this.postService.create(createPostDto);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    try {
      return await this.postService.update(id, updatePostDto);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
