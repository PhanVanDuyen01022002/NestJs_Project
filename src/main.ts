import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Bật global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // chỉ nhận field có trong DTO, bỏ field thừa
      forbidNonWhitelisted: true, // báo lỗi nếu có field không khai báo
      transform: true, // tự động chuyển kiểu dữ liệu
    }),
  );

  // Dùng interceptor để format tất cả response về dạng chuẩn
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Dùng filter để xử lý tất cả lỗi và trả về JSON chuẩn
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
