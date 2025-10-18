import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly userService: UserService,
  ) {}

  async create(postData: CreatePostDto) {
    const { userId, ...data } = postData;
    try {
      const user = await this.userService.findById(userId);
      const post = this.postRepository.create({ ...data, user });
      return this.postRepository.save(post);
    } catch {
      throw new NotFoundException('User không tồn tại!');
    }
  }

  findAll() {
    return this.postRepository.find({ relations: { user: { phone: true } } });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const { userId, ...postData } = updatePostDto;
    let user: User | undefined;

    try {
      const oldPost = await this.postRepository.findOne({
        where: { id },
        relations: { user: true },
      });

      if (!oldPost) throw new NotFoundException('Bài viết không tồn tại');

      const newPost = this.postRepository.merge(oldPost, postData);

      if (userId && newPost.user?.id !== userId) {
        try {
          user = await this.userService.findById(userId);
          newPost.user = user;
        } catch (error) {
          if (error instanceof NotFoundException)
            throw new NotFoundException('User Không tồn tại!');
        }
      }

      return this.postRepository.save(newPost);
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
