"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("../app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const expressApp = (0, express_1.default)();
let app;
async function bootstrap() {
    const logger = new common_1.Logger('Serverless');
    logger.log('Bootstrapping NestJS...');
    app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp), { logger: ['error', 'warn', 'log'] });
    app.enableCors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.init();
    logger.log('NestJS initialized successfully.');
}
async function handler(req, res) {
    try {
        if (!app) {
            await bootstrap();
        }
        if (req.url) {
            if (req.url.startsWith('/api/backend')) {
                req.url = req.url.replace('/api/backend', '');
            }
            else if (req.url.startsWith('/backend/api')) {
                req.url = req.url.replace('/backend/api', '');
            }
            else if (req.url.startsWith('/backend/dist/api')) {
                req.url = req.url.replace('/backend/dist/api', '');
            }
        }
        expressApp(req, res);
    }
    catch (err) {
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
//# sourceMappingURL=index.js.map