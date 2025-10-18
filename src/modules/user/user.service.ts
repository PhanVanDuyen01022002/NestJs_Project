import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { BaseService } from 'src/common/base/base.service';
import { Phone } from 'src/entities/phone.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Course } from 'src/entities/course.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {
    super(userRepository);
  }

  async createUser(data: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { phone, ...userData } = data;

      data.password = await bcrypt.hash(data.password, 10);

      // 1. Lưu User và nhận lại instance có ID
      const user = this.userRepository.create(userData);
      const savedUser = await queryRunner.manager.save(User, user);

      // 2. Tạo Phone và liên kết với User đã lưu
      const phoneEntity = this.phoneRepository.create({
        phone,
        user: savedUser,
      });

      const phoneSaved = await queryRunner.manager.save(Phone, phoneEntity);

      await queryRunner.commitTransaction();
      return { ...savedUser, phoneSaved };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof Error) throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  findByPhone(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['phone'],
    });
  }

  async findPostsByUserId(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { posts: true, phone: true },
    });

    return user;
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { phone, courseIds, ...userData } = data;

      const userToUpdate = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: {
          phone: true,
          courses: true,
        },
      });

      if (!userToUpdate) {
        throw new NotFoundException(`User với ID ${userId} không tồn tại.`);
      }

      queryRunner.manager.merge(User, userToUpdate, userData); //ghi đè userData vào userToUpdate

      if (data.password) {
        userToUpdate.password = await bcrypt.hash(data.password, 10);
      }

      if (phone) {
        if (userToUpdate.phone) {
          userToUpdate.phone.phone = phone;
        } else {
          userToUpdate.phone = this.phoneRepository.create({
            phone: phone,
            user: userToUpdate,
          });
        }
      }

      if (courseIds) {
        const courses = await queryRunner.manager.findBy(Course, {
          id: In(courseIds),
        });

        if (courses.length !== new Set(courseIds).size) {
          throw new BadRequestException(
            'Một hoặc nhiều courseId không hợp lệ.',
          );
        }

        const newCourses = courses.filter((course) => {
          return !userToUpdate.courses.some(
            (enrolledCourses) => enrolledCourses.id === course.id,
          );
        });

        userToUpdate.courses = [...userToUpdate.courses, ...newCourses];
      }

      const savedUser = await queryRunner.manager.save(userToUpdate);

      await queryRunner.commitTransaction();

      const { password: _password, ...result } = savedUser;
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Ném lại các lỗi đã được xử lý (404, 400) để NestJS trả về đúng status code
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Ném lỗi 500 cho các trường hợp còn lại để che giấu chi tiết lỗi
      throw new InternalServerErrorException('Đã có lỗi xảy ra phía server.');
    } finally {
      await queryRunner.release();
    }
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

  async saveRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;

    return this.userRepository.save(user);
  }

  async verifyRefreshToken(refreshToken: string, id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (user && user.refreshToken) {
      const checkRefreshToken = (await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      ))
        ? true
        : false;

      return checkRefreshToken && user;
    }
    return false;
  }
}
