import { ConfigService } from '@nestjs/config';
export interface CloudinaryUploadResult {
    publicId: string;
    secureUrl: string;
    originalFilename: string;
    resourceType: string;
    format: string;
    width?: number;
    height?: number;
    bytes: number;
    folder: string;
}
export declare class CloudinaryService {
    private config;
    private readonly logger;
    private readonly configured;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    uploadBuffer(buffer: Buffer, options: {
        folder: string;
        filename?: string;
        mimeType?: string;
    }): Promise<string>;
    uploadBufferFull(buffer: Buffer, options: {
        folder: string;
        filename?: string;
        mimeType?: string;
    }): Promise<CloudinaryUploadResult>;
    uploadBase64Image(dataUrl: string, folder: string, publicId?: string): Promise<string>;
    deleteFile(publicId: string, resourceType?: 'image' | 'video' | 'raw'): Promise<void>;
    deleteFiles(publicIds: string[]): Promise<void>;
    private mapResult;
    private assertConfigured;
}
