import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();

let app: any = null;
let bootstrapPromise: Promise<any> | null = null;

async function bootstrap() {
  const logger = new Logger('Vercel');

  logger.log('Starting NestJS serverless application...');

  logger.log(
    `DATABASE_URL exists: ${Boolean(process.env.DATABASE_URL)}`,
  );

  logger.log(
    `DIRECT_URL exists: ${Boolean(process.env.DIRECT_URL)}`,
  );

  logger.log(
    `JWT_SECRET exists: ${Boolean(process.env.JWT_SECRET)}`,
  );

  const frontendUrl =
    process.env.FRONTEND_URL ||
    'http://localhost:3000';

  app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: ['error', 'warn', 'log'],
    },
  );

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();

  logger.log('NestJS initialized successfully.');

  return app;
}

export default async function handler(
  req: any,
  res: any,
) {
  try {
    if (!app) {
      if (!bootstrapPromise) {
        bootstrapPromise = bootstrap().catch((error) => {
          bootstrapPromise = null;
          throw error;
        });
      }

      await bootstrapPromise;
    }

    console.log(
      'Original request URL:',
      req.url,
    );

    if (req.url) {
      if (req.url.startsWith('/api/backend')) {
        req.url = req.url.replace(
          '/api/backend',
          '',
        );
      } else if (
        req.url.startsWith('/backend/api')
      ) {
        req.url = req.url.replace(
          '/backend/api',
          '',
        );
      } else if (
        req.url.startsWith('/backend/dist/api')
      ) {
        req.url = req.url.replace(
          '/backend/dist/api',
          '',
        );
      }
    }

    console.log(
      'Normalized request URL:',
      req.url,
    );

    return expressApp(req, res);
  } catch (error: any) {
    console.error(
      '========== SERVERLESS ERROR ==========',
    );

    console.error(error);
    console.error('Message:', error?.message);
    console.error('Stack:', error?.stack);

    console.error(
      '======================================',
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'Backend Serverless Error',
        message:
          process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error?.message ||
            String(error),
      });
    }
  }
}