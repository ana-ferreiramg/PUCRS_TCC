import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@shared/config/config.service';
import axios from 'axios';

@Injectable()
export class ImgurService {
  constructor(private readonly configService: ConfigService) {}

  extractImageIdFromUrl(imageUrl: string): string {
    try {
      const parsedUrl = new URL(imageUrl);
      const filename = parsedUrl.pathname.split('/').pop();
      if (!filename) return undefined;
      return filename.split('.')[0];
    } catch {
      return undefined;
    }
  }

  async uploadImage(
    base64Image: string,
  ): Promise<{ link: string; deleteHash: string }> {
    const clientId = this.configService.imgurClientId;
    const apiUrl = this.configService.imgurApiUrl;

    if (!clientId) {
      throw new InternalServerErrorException('Imgur Client ID não configurado');
    }

    try {
      const response = await axios.post(
        apiUrl,
        { image: base64Image, type: 'base64' },
        {
          headers: {
            Authorization: `Client-ID ${clientId}`,
          },
        },
      );

      const { link, deletehash } = response.data?.data || {};

      if (!link || !deletehash) {
        throw new InternalServerErrorException(
          'Resposta inesperada da API do Imgur: dados incompletos.',
        );
      }

      return { link, deleteHash: deletehash };
    } catch (error) {
      console.error(
        'Erro ao fazer upload para o Imgur:',
        error?.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        `Erro ao fazer upload da imagem: ${error?.response?.data?.error || error.message}`,
      );
    }
  }

  async deleteImage(imageId: string): Promise<void> {
    const clientId = this.configService.imgurClientId;
    const apiUrl = `${this.configService.imgurApiUrl}/${imageId}`;

    if (!clientId) {
      throw new InternalServerErrorException('Imgur Client ID não configurado');
    }

    try {
      const response = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
      });

      if (response.data.success) {
        console.log(`Imagem ${imageId} excluída com sucesso do Imgur`);
      } else {
        throw new InternalServerErrorException(
          'Erro ao excluir imagem do Imgur',
        );
      }
    } catch (error) {
      console.error(
        'Erro ao excluir imagem do Imgur:',
        error?.response?.data || error.message,
      );
      throw new InternalServerErrorException('Erro ao excluir imagem do Imgur');
    }
  }
}
