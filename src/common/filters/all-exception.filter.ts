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
  [key: string]: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    // ✅ Trường hợp NestJS ném HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse: unknown = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object' && errorResponse !== null) {
        const obj = errorResponse as ErrorObject;
        if (typeof obj.message === 'string') {
          message = obj.message;
        } else if (Array.isArray(obj.message)) {
          message = obj.message.map(String).join(', ');
        }
      }
    }

    // ✅ Trường hợp lỗi JS runtime
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // ✅ Trả về response JSON chuẩn
    response.status(status).json(new ResponseData(null, status, message));
  }
}
