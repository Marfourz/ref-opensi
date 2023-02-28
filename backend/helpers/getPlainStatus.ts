import { OrderStatusEnum } from '@prisma/client';

export const getPlainStatus = (status: OrderStatusEnum) => {
  switch (status) {
    case 'new':
      return 'Nouveau';
      break;
    case 'accepted':
      return 'Accepté';
      break;
    case 'delivered':
      return 'Livrée';
      break;
    default:
      break;
  }
};
