import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugifyService {
  generateSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
    });
  }
}
