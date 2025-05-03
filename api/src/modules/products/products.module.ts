import { Module } from '@nestjs/common';
import { ConfigModule } from '@shared/config/config.module';
import { FileService } from '@shared/utils/file.service';
import { ImageService } from '@shared/utils/image.service';
import { ImgurService } from '@shared/utils/imgur.service';
import { SharpService } from '@shared/utils/sharp.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [ConfigModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ImgurService,
    SharpService,
    FileService,
    ImageService,
  ],
})
export class ProductsModule {}
