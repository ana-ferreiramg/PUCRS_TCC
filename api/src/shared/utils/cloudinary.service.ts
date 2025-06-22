import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@shared/config/config.service';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.cloudinaryCloudName,
      api_key: this.configService.cloudinaryApiKey,
      api_secret: this.configService.cloudinaryApiSecret,
    });
  }

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
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== 'ok') {
        throw new Error(`Não foi possível deletar: ${result.result}`);
      }

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
