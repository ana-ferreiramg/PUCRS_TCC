import { InternalServerErrorException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';

// Verifica se a pasta 'uploads' existe, se não, cria
const uploadPath = path.join(process.cwd(), 'uploads');
if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath);
}

export const multerConfig = {
  storage: diskStorage({
    destination: uploadPath, // Define o caminho para a pasta 'uploads'
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new InternalServerErrorException(
          `Formato de imagem inválido: ${file.mimetype}. Apenas JPEG, PNG e WEBP são permitidos.`,
        ),
        false,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // Limita o tamanho do arquivo a 10MB
  },
};
