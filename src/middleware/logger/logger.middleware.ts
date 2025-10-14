import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const start = Date.now();

    res.on('finish', () => {
      const { method, originalUrl } = req;
      const status = res.statusCode;
      const responseTime = Date.now() - start;
      const time = new Date().toLocaleTimeString('en-GB', { hour12: false }); // → 14:35:07

      // 🎨 Màu cho method
      const methodColor =
        {
          GET: '\x1b[32m', // xanh lá
          POST: '\x1b[34m', // xanh dương
          PUT: '\x1b[33m', // vàng
          DELETE: '\x1b[31m', // đỏ
          PATCH: '\x1b[35m', // tím
        }[method] || '\x1b[37m'; // trắng mặc định

      // 🟩 Emoji có màu sẵn
      let emoji = '✅';
      let statusColor = '\x1b[32m';
      if (status >= 500) {
        emoji = '❌';
        statusColor = '\x1b[31m'; // đỏ
      } else if (status >= 400) {
        emoji = '⚠️ ';
        statusColor = '\x1b[33m'; // vàng
      }

      const reset = '\x1b[0m';

      console.log(
        `${reset}[${time}] ${emoji} ${methodColor}${method}${reset} ${originalUrl} → ${statusColor}${status}${reset} (${responseTime}ms)`,
      );
    });

    next();
  }
}
