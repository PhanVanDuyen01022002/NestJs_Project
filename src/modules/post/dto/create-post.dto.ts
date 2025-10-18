import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @Length(2, 255, { message: 'Title must be between 1 and 225 characters' })
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @IsOptional()
  @IsString({ message: 'userId must be a string' })
  userId: string;
}
