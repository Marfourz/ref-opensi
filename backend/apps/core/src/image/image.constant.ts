import { ConfigService } from '@nestjs/config';

export const PRODUCT_IMAGES_DEST = new ConfigService().get(
  'PRODUCT_IMAGES_DEST',
);

export const PRODUCT_IMAGE_BASE_URL =
  new ConfigService().get('APP_URL') + '/product-image/';
