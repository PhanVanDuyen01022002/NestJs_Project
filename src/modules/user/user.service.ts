import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async create(data: CreateUserDto) {
    const checkUser = await this.userRepository.findOneBy({
      email: data.email,
    });

    if (checkUser) {
      throw new Error('Email already exists');
    }

    data.password = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create(data);

    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
