import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function createNestServer(expressInstance: express.Express) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    { logger: ['error', 'warn'] },
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
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
  return app;
}

let isReady = false;

export default async function handler(req: any, res: any) {
  try {
    if (!isReady) {
      await createNestServer(server);
      isReady = true;
    }

    if (req.url) {
      if (req.url.startsWith('/api/backend')) {
        req.url = req.url.replace('/api/backend', '');
      } else if (req.url.startsWith('/backend/api')) {
        req.url = req.url.replace('/backend/api', '');
      }
    }

    server(req, res);
  } catch (err: any) {
    console.error('Serverless Handler Error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Backend Serverless Error',
        message: err?.message || String(err),
        stack: err?.stack,
      });
    }
  }
}
