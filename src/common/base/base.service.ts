import {
  Repository,
  DeepPartial,
  ObjectLiteral,
  FindOptionsWhere,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findOneBy({
      id,
    } as unknown as FindOptionsWhere<T>);
    if (!entity) {
      throw new NotFoundException('Item not found');
    }
    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.repository.preload({
      id,
      ...data,
    } as DeepPartial<T>);
    if (!entity) {
      throw new NotFoundException('Item not found');
    }
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.repository.delete(
      id as unknown as FindOptionsWhere<T>,
    );
    if (result.affected === 0) {
      throw new NotFoundException('Item not found');
    }
    return { message: 'Deleted successfully' };
  }
}
