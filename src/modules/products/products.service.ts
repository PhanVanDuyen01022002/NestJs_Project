import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from 'src/entities/Product';
import { Repository } from 'typeorm';
import { ProductCreateDto } from './dto/product-create';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAll() {
    return this.productsRepository.find();
  }

  create(productData: ProductCreateDto) {
    const product = this.productsRepository.create(productData);
    return this.productsRepository.save(product);
  }

  async update(id: string, productData: ProductCreateDto) {
    const product = await this.productsRepository.preload({
      id,
      ...productData,
    });
    if (!product) {
      throw new Error('Product not found');
    }

    return this.productsRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new Error('Product not found');
    }
    await this.productsRepository.delete(id);
    return { message: 'Product deleted successfully', product };
  }
}
