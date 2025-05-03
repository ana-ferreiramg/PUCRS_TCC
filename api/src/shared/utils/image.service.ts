// src/shared/services/image.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { lookup as getMimeType } from 'mime-types';

@Injectable()
export class ImageService {
  validateImageType(imagePath: string): void {
    const mimeType = getMimeType(imagePath);
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
      throw new InternalServerErrorException(
        `Formato de imagem inválido: ${mimeType}. Apenas JPEG, PNG e WEBP são permitidos.`,
      );
    }
  }

  readImageFile(imagePath: string): Buffer {
    try {
      return fs.readFileSync(imagePath);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao ler a imagem do disco.',
        error,
      );
    }
  }
}
