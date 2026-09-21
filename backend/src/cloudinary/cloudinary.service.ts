import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly configured: boolean;

  constructor(private config: ConfigService) {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');

    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (this.configured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    } else {
      this.logger.warn(
        'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      );
    }
  }

  isConfigured() {
    return this.configured;
  }

  async uploadBuffer(
    buffer: Buffer,
    options: {
      folder: string;
      filename?: string;
      mimeType?: string;
    },
  ): Promise<string> {
    this.assertConfigured();

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          public_id: options.filename,
          resource_type: 'auto',
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error('Cloudinary upload failed'));
            return;
          }
          resolve(uploadResult);
        },
      );

      upload.end(buffer);
    });

    return result.secure_url;
  }

  async uploadBase64Image(
    dataUrl: string,
    folder: string,
    publicId?: string,
  ): Promise<string> {
    this.assertConfigured();

    if (!dataUrl.startsWith('data:image/')) {
      throw new BadRequestException('Photo must be a valid image data URL');
    }

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder,
      public_id: publicId,
      resource_type: 'image',
      overwrite: true,
    });

    return result.secure_url;
  }

  private assertConfigured() {
    if (!this.configured) {
      throw new BadRequestException(
        'Cloudinary is not configured on the server. Contact your administrator.',
      );
    }
  }
}
