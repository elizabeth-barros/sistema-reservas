import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS ?? '').split(','),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ]
    .filter(Boolean)
    .map((origin) => origin!.trim().replace(/\/$/, ''));

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin?.replace(/\/$/, '');
      const isLocal = !origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
      const isVercelPreview = Boolean(normalizedOrigin?.endsWith('.vercel.app'));
      const isConfigured = Boolean(normalizedOrigin && configuredOrigins.includes(normalizedOrigin));

      if (isLocal || isVercelPreview || isConfigured) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
