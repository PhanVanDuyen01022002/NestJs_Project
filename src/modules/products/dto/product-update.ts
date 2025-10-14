import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class ProductUpdateDto {
  @IsOptional()
  @IsString({ message: 'Product name must be a string' })
  @Length(1, 225, {
    message: 'Product name must be between 1 and 225 characters',
  })
  name: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}
