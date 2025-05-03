// src/shared/utils/file.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  // Deletar o arquivo
  async deleteFileIfExists(filePath: string): Promise<void> {
    const relativePath = path.relative(process.cwd(), filePath);
    try {
      await unlink(filePath);
      this.logger.log(`Arquivo deletado com sucesso: ${relativePath}`);
    } catch (error) {
      this.logger.warn(
        `⚠️ Não foi possível deletar o arquivo: ${relativePath}`,
        error.message,
      );
    }
  }
}
