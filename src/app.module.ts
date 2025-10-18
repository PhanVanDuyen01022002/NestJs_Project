import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { RoleMiddleware } from './middleware/role/role.middleware';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './modules/post/post.module';
import { CourseModule } from './modules/course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    UserModule,
    AuthModule,
    ProductsModule,

    TypeOrmModule.forRoot({
      type: process.env.DB_DRIVER as
        | 'mysql'
        | 'postgres'
        | 'mongodb'
        | 'sqlite',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'], // Danh sách các entity sẽ ánh xạ
      synchronize: true, // Tự động tạo bảng từ entity (chỉ dùng trong development)
      // logging: true, // Hiển thị các câu lệnh SQL trong console
      // charset: 'utf8mb4_general_ci',
    }),

    PostModule,

    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(RoleMiddleware).forRoutes('products');
  }
}
