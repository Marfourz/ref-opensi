const Mailgen = require('mailgen');
import { ConfigService } from '@nestjs/config';

const FRONT_APP_URL = new ConfigService().get('FRONTEND_BASE_URL');

const mailGenerator: any = new Mailgen({
  theme: 'default',
  product: {
    name: 'SNB',
    link: 'https://snb.io/',
    logo: 'https://snb.io/img/logo.png',
  },
});
export const NOTIFICATION_MESSAGES = {
  registrationMail: ({ name, email, token }) => {
    return mailGenerator.generate({
      body: {
        name,
        intro:
          'Bienvenue sur SNB! Nous sommes trés content de vous avoir a bord.',
        action: {
          instructions:
            'Pour commencer , cliquez sur le lien suivant pour définir votre mot de passe',
          button: {
            color: '#22BC66',
            text: 'Définir mon mot de passe',
            link: `${FRONT_APP_URL}/auth/definePassword?username=${email}&t=${token}`,
          },
        },
        outro:
          "Pour plus de renseignements, contactez nous à l'adresse suivante : contact@snb.io",
      },
    });
  },
};
