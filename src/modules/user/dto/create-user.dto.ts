import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}
