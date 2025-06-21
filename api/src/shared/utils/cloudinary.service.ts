import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@shared/config/config.service';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(
    filePath: string,
  ): Promise<{ url: string; public_id: string }> {
    const form = new FormData();
    const file = fs.createReadStream(filePath);

    form.append('file', file);
    form.append('upload_preset', this.configService.cloudinaryUploadPreset);

    try {
      const response = await axios.post(
        this.configService.cloudinaryApiUrl,
        form,
        { headers: form.getHeaders() },
      );

      const { secure_url, public_id } = response.data;

      return { url: secure_url, public_id };
    } catch (error) {
      console.error(
        'Erro ao enviar imagem para o Cloudinary:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Erro ao fazer upload da imagem para o Cloudinary.',
      );
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    const cloudName = this.configService.cloudinaryCloudName;
    const apiKey = this.configService.cloudinaryApiKey;
    const apiSecret = this.configService.cloudinaryApiSecret;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`;

    const auth = {
      username: apiKey,
      password: apiSecret,
    };

    try {
      await axios.delete(`${url}/${publicId}`, {
        auth,
      });
      console.log(`Imagem ${publicId} deletada com sucesso do Cloudinary.`);
    } catch (error) {
      console.error(
        'Erro ao deletar imagem do Cloudinary:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Erro ao deletar imagem do Cloudinary.',
      );
    }
  }
}
