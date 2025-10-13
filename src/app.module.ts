import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,

    TypeOrmModule.forRoot({
      type: 'mysql', // Loại database: mysql, postgres, sqlite, etc.
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest_courses',
      entities: [User], // Danh sách các entity sẽ ánh xạ
      synchronize: true, // Tự động tạo bảng từ entity (chỉ dùng trong development)
      // logging: true, // Hiển thị các câu lệnh SQL trong console
      charset: 'utf8mb4_general_ci',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
