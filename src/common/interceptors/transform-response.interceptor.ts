import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseData } from '../globalClass';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Nếu controller đã trả về ResponseData thì giữ nguyên
        if (data instanceof ResponseData) return data;

        // Nếu controller trả về raw data
        return new ResponseData(data, HttpStatus.OK, 'Success');
      }),
    );
  }
}
