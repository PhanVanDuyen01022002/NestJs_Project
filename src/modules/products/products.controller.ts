import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCreateDto } from './dto/product-create';
import { ProductUpdateDto } from './dto/product-update';

@Controller('products')
// @UsePipes(new ValidationPipe({ transform: true })) // Cách này cũng được, nhưng sẽ áp dụng riêng cho controller này(không phải toàn cục)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list() {
    return this.productsService.findAll();
  }

  @Post()
  async create(@Body() body: ProductCreateDto) {
    try {
      const product = await this.productsService.create(body);
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: ProductUpdateDto) {
    try {
      const product = await this.productsService.update(id, body);
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const product = await this.productsService.remove(id);
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
