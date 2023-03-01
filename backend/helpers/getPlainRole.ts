import { UserRoleEnum } from '@prisma/client';

export const getPlainRole = (role: UserRoleEnum) => {
  switch (role) {
    case UserRoleEnum.superUser:
      return 'SUPER UTILISATEUR';
      break;
    case UserRoleEnum.administrator:
      return 'ADMINISTRATEUR';
      break;
    case UserRoleEnum.accountant:
      return 'COMPTABLE';
      break;
    case UserRoleEnum.commercial:
      return 'COMMERCIAL';
      break;
    case UserRoleEnum.deliveryMan:
      return 'LIVREUR';
      break;
    default:
      break;
  }
};
