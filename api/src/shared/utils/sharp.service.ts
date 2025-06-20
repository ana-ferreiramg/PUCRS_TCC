import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class SharpService {
  private readonly logger = new Logger(SharpService.name);

  async optimize(
    inputBuffer: Buffer,
    options: {
      format?: 'jpeg' | 'png' | 'webp';
      quality?: number;
      maxWidth?: number;
    } = {},
  ): Promise<Buffer> {
    const { format = 'jpeg', quality = 80, maxWidth = 800 } = options;

    try {
      const image = sharp(inputBuffer);
      image.resize({ width: maxWidth });
      const optimizedBuffer = await image[format]({ quality }).toBuffer();
      return optimizedBuffer;
    } catch (error) {
      this.logger.error('Erro ao otimizar imagem com Sharp', error);
      throw new InternalServerErrorException(
        'Erro ao otimizar a imagem: ' + error.message,
      );
    }
  }
}
