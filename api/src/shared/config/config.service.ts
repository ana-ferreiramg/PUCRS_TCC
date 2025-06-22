import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { z } from 'zod';

// Definindo o schema de validação com Zod
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT secret must be at least 16 characters long'),
  JWT_EXPIRATION: z.coerce.number().min(1).default(86400), // 86400 segundos = 1 dia
  WS_ORIGIN: z.string().url().default('ws://localhost:3001'),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_UPLOAD_PRESET: z.string(),
  CLOUDINARY_API_URL: z.string().url(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

type EnvConfig = z.infer<typeof envSchema>;

@Injectable()
export class ConfigService {
  private readonly config: EnvConfig;

  constructor(private readonly nestConfig: NestConfigService) {
    // Monta o objeto manualmente
    const rawEnv = {
      NODE_ENV: nestConfig.get<string>('NODE_ENV'),
      PORT: nestConfig.get<string | number>('PORT'),
      DATABASE_URL: nestConfig.get<string>('DATABASE_URL'),
      FRONTEND_URL: nestConfig.get<string>('FRONTEND_URL'),
      JWT_SECRET: nestConfig.get<string>('JWT_SECRET'),
      JWT_EXPIRATION: nestConfig.get<string | number>('JWT_EXPIRATION'),
      WS_ORIGIN: nestConfig.get<string>('WS_ORIGIN'),
      CLOUDINARY_API_URL: nestConfig.get<string>('CLOUDINARY_API_URL'),
      CLOUDINARY_UPLOAD_PRESET: nestConfig.get<string>(
        'CLOUDINARY_UPLOAD_PRESET',
      ),
      CLOUDINARY_CLOUD_NAME: nestConfig.get<string>('CLOUDINARY_CLOUD_NAME'),
      CLOUDINARY_API_KEY: nestConfig.get<string>('CLOUDINARY_API_KEY'),
      CLOUDINARY_API_SECRET: nestConfig.get<string>('CLOUDINARY_API_SECRET'),
    };

    // Valida com Zod
    this.config = envSchema.parse(rawEnv);
  }

  // Porta da API
  get port(): number {
    return +this.config.PORT;
  }

  get nodeEnv(): string {
    return this.config.NODE_ENV;
  }

  // Banco de Dados
  get databaseUrl(): string {
    return this.config.DATABASE_URL;
  }

  // Frontend para CORS
  get frontendUrl(): string {
    return this.config.FRONTEND_URL;
  }

  // JWT
  get jwtSecret(): string {
    return this.config.JWT_SECRET;
  }

  get jwtExpiration(): number {
    return this.config.JWT_EXPIRATION;
  }

  // WEB SOCKETS
  get wsServerUrl(): string {
    return this.config.WS_ORIGIN;
  }

  get cloudinaryCloudName(): string {
    return this.config.CLOUDINARY_CLOUD_NAME;
  }

  get cloudinaryUploadPreset(): string {
    return this.config.CLOUDINARY_UPLOAD_PRESET;
  }

  get cloudinaryApiUrl(): string {
    return this.config.CLOUDINARY_API_URL;
  }

  get cloudinaryApiSecret(): string {
    return this.config.CLOUDINARY_API_SECRET;
  }

  get cloudinaryApiKey(): string {
    return this.config.CLOUDINARY_API_KEY;
  }
}
