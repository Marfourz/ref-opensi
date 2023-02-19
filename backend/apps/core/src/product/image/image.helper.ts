import { extname } from 'path';
import { PRODUCT_IMAGE_BASE_URL } from './image.constant';

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const fileExtName = extname(file.originalname);
  callback(null, `${name}-${uniqueSuffix}${fileExtName}`);
};

export const getProductImageLink = (filename) => {
  return PRODUCT_IMAGE_BASE_URL + filename;
};
