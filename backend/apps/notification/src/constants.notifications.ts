import { ConfigService } from '@nestjs/config';

const FRONT_APP_URL = new ConfigService().get('FRONTEND_BASE_URL');

export const NOTIFICATION_MESSAGES = {
  registrationMail: (data) => {
    return `Vous venez de vous inscrire voici votre nom d'utilisateur : ${data.email} cliquez sur ce lien pour définir votre mot de passe : ${FRONT_APP_URL}/auth/definePassword?username=${data.email}&t=${data.token}`;
  },
};
