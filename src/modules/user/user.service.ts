import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.findOneBy({ id });
  }

  findAll() {
    return this.userRepository.find();
  }

  create(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.userRepository.preload({
      id,
      ...data,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.userRepository.save(user);
  }
}
