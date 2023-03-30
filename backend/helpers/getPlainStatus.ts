import { OrganisationStatusEnum } from '@prisma/client';
import {
  OrderStatusEnum,
  OrganisationTypeEnum,
  PackagingTypeEnum,
} from '@prisma/client';

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

export const getPlainStatusOfPartners = (status: OrganisationStatusEnum) => {
  switch (status) {
    case OrganisationStatusEnum.active:
      return 'ACTIF';
      break;
    case OrganisationStatusEnum.inactive:
      return 'INACTIF';
      break;
    default:
      break;
  }
};

export const getPlainPackagingType = (type: PackagingTypeEnum) => {
  switch (type) {
    case PackagingTypeEnum.pack:
      return 'Packs';
      break;
    case PackagingTypeEnum.rack:
      return 'Casiers';
      break;
    default:
      break;
  }
};

export const getSubTypeOrg = (type: OrganisationTypeEnum) => {
  switch (type) {
    case OrganisationTypeEnum.snb:
      return 'md';
      break;
    case OrganisationTypeEnum.md:
      return 'da';
      break;
    case OrganisationTypeEnum.da:
      return 'dp';
      break;
    case OrganisationTypeEnum.dp:
      return 'none';
      break;
    default:
      break;
  }
};
