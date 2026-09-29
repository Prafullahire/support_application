"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CloudinaryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = CloudinaryService_1 = class CloudinaryService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(CloudinaryService_1.name);
        const cloudName = this.config.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.config.get('CLOUDINARY_API_KEY');
        const apiSecret = this.config.get('CLOUDINARY_API_SECRET');
        this.configured = Boolean(cloudName && apiKey && apiSecret);
        if (this.configured) {
            cloudinary_1.v2.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
                secure: true,
            });
            this.logger.log('Cloudinary configured successfully.');
        }
        else {
            this.logger.warn('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
        }
    }
    isConfigured() {
        return this.configured;
    }
    async uploadBuffer(buffer, options) {
        const result = await this.uploadBufferFull(buffer, options);
        return result.secureUrl;
    }
    async uploadBufferFull(buffer, options) {
        this.assertConfigured();
        const result = await new Promise((resolve, reject) => {
            const upload = cloudinary_1.v2.uploader.upload_stream({
                folder: options.folder,
                public_id: options.filename,
                resource_type: 'auto',
            }, (error, uploadResult) => {
                if (error || !uploadResult) {
                    reject(error ?? new Error('Cloudinary upload failed'));
                    return;
                }
                resolve(uploadResult);
            });
            upload.end(buffer);
        });
        return this.mapResult(result);
    }
    async uploadBase64Image(dataUrl, folder, publicId) {
        this.assertConfigured();
        if (!dataUrl.startsWith('data:image/')) {
            throw new common_1.BadRequestException('Photo must be a valid image data URL');
        }
        const result = await cloudinary_1.v2.uploader.upload(dataUrl, {
            folder,
            public_id: publicId,
            resource_type: 'image',
            overwrite: true,
        });
        return result.secure_url;
    }
    async deleteFile(publicId, resourceType = 'image') {
        this.assertConfigured();
        try {
            await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: resourceType });
            this.logger.log(`Deleted Cloudinary asset: ${publicId}`);
        }
        catch (err) {
            this.logger.error(`Failed to delete Cloudinary asset ${publicId}`, err);
            throw err;
        }
    }
    async deleteFiles(publicIds) {
        this.assertConfigured();
        if (!publicIds.length)
            return;
        try {
            await cloudinary_1.v2.api.delete_resources(publicIds);
            this.logger.log(`Deleted ${publicIds.length} Cloudinary assets`);
        }
        catch (err) {
            this.logger.error('Failed to bulk-delete Cloudinary assets', err);
            throw err;
        }
    }
    mapResult(result) {
        return {
            publicId: result.public_id,
            secureUrl: result.secure_url,
            originalFilename: result.original_filename,
            resourceType: result.resource_type,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            folder: result.folder ?? '',
        };
    }
    assertConfigured() {
        if (!this.configured) {
            throw new common_1.BadRequestException('Cloudinary is not configured on the server. Contact your administrator.');
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = CloudinaryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map