"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const expressApp = (0, express_1.default)();
let app = null;
let bootstrapPromise = null;
async function bootstrap() {
    const logger = new common_1.Logger('Vercel');
    logger.log('======================================');
    logger.log('Starting NestJS serverless function');
    logger.log('======================================');
    logger.log(`NODE_ENV: ${process.env.NODE_ENV || 'not-set'}`);
    logger.log(`DATABASE_URL exists: ${Boolean(process.env.DATABASE_URL)}`);
    logger.log(`DIRECT_URL exists: ${Boolean(process.env.DIRECT_URL)}`);
    logger.log(`JWT_SECRET exists: ${Boolean(process.env.JWT_SECRET)}`);
    logger.log(`FRONTEND_URL exists: ${Boolean(process.env.FRONTEND_URL)}`);
    logger.log('Loading AppModule...');
    const { AppModule } = await Promise.resolve().then(() => __importStar(require('../app.module')));
    logger.log('AppModule loaded successfully.');
    logger.log('Creating NestJS application...');
    app = await core_1.NestFactory.create(AppModule, new platform_express_1.ExpressAdapter(expressApp), {
        logger: ['error', 'warn', 'log'],
    });
    logger.log('NestJS application created.');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    app.enableCors({
        origin: frontendUrl,
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    logger.log('Initializing NestJS...');
    await app.init();
    logger.log('======================================');
    logger.log('NestJS initialized successfully');
    logger.log('======================================');
    return app;
}
async function handler(req, res) {
    try {
        console.log('======================================');
        console.log('SERVERLESS REQUEST START');
        console.log('======================================');
        console.log('Method:', req.method);
        console.log('Original URL:', req.url);
        if (!app) {
            if (!bootstrapPromise) {
                bootstrapPromise = bootstrap().catch((error) => {
                    bootstrapPromise = null;
                    throw error;
                });
            }
            await bootstrapPromise;
        }
        if (req.url) {
            if (req.url.startsWith('/api/backend')) {
                req.url = req.url.replace('/api/backend', '');
            }
            else if (req.url.startsWith('/backend/api')) {
                req.url = req.url.replace('/backend/api', '');
            }
        }
        console.log('Normalized URL:', req.url);
        console.log('Sending request to NestJS...');
        return expressApp(req, res);
    }
    catch (error) {
        console.error('======================================');
        console.error('SERVERLESS FUNCTION ERROR');
        console.error('======================================');
        console.error('Error name:', error?.name);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        console.error('Full error:', error);
        console.error('======================================');
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                error: 'Backend Serverless Error',
                message: error?.message || 'Unknown serverless error',
            });
        }
        return;
    }
}
//# sourceMappingURL=index.js.map