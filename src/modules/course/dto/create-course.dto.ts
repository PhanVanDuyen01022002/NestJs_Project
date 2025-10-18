import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
  name: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  price: number;
}
