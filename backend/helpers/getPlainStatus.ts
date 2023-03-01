import { OrderStatusEnum } from '@prisma/client';

export const getPlainStatus = (status: OrderStatusEnum) => {
  switch (status) {
    case OrderStatusEnum.new:
      return 'Nouveau';
      break;
    case OrderStatusEnum.accepted:
      return 'Accepté';
      break;
    case OrderStatusEnum.delivered:
      return 'Livrée';
      break;
    default:
      break;
  }
};
