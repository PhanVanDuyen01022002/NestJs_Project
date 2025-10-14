import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseData } from '../globalClass';

interface ErrorObject {
  message?: string | string[];
  errors?: unknown;
  [key: string]: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal Server Error';

    // ✅ Trường hợp NestJS ném HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        // ✅ Ép kiểu an toàn để tránh lỗi "unsafe assignment"
        const obj: ErrorObject = { ...errorResponse };

        // ✅ Xử lý message
        if (typeof obj.message === 'string') {
          message = obj.message;
        } else if (Array.isArray(obj.message)) {
          console.log('obj.message', obj.message);

          message = obj.message;
        }
      }
    }

    // ✅ Trường hợp lỗi JS runtime
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // ✅ Trường hợp khác (không phải Error)
    else {
      message = String(exception);
    }

    // ✅ Trả về response JSON chuẩn
    response.status(status).json(new ResponseData(null, status, message));
  }
}
