import { Module } from '@nestjs/common';
import { ConfigModule } from '@shared/config/config.module';
import { CloudinaryService } from '@shared/utils/cloudinary.service';
import { FileService } from '@shared/utils/file.service';
import { ImageService } from '@shared/utils/image.service';
import { SharpService } from '@shared/utils/sharp.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PublicProductsController } from './public-products.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ProductsController, PublicProductsController],
  providers: [
    ProductsService,
    CloudinaryService,
    SharpService,
    FileService,
    ImageService,
  ],
})
export class ProductsModule {}
