const Mailgen = require('mailgen');
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

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
    const FRONT_APP_URL = new ConfigService().get('FRONTEND_BASE_URL');
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
  getResetPasswordCodeMail: ({ email, otp }) => {
    const FRONT_APP_URL = new ConfigService().get('FRONTEND_BASE_URL');
    return mailGenerator.generate({
      body: {
        name: email,
        intro: 'Votre code OTP de réinitialisation de votre mot de passe.',
        action: {
          instructions:
            "Copiez ce code au niveau de  l'interface web pour mettre à jour votre mot de passe",
          button: {
            color: '#22BC66',
            text: otp,
            link: `${FRONT_APP_URL}/resetCode/${otp}`,
          },
        },
        outro:
          "Pour plus de renseignements, contactez nous à l'adresse suivante : contact@snb.io",
      },
    });
  },
  acceptedOrderMail: (organisation, order) => {
    const FRONT_APP_URL = new ConfigService().get('FRONTEND_BASE_URL');
    return mailGenerator.generate({
      body: {
        name: organisation.ownerName,
        intro: `La commande que vous avez initialisée à la date du ${dayjs(
          order.createdAt,
        ).format('YYYY-MM-DD HH:mm:ss')} ayant pour référence : #${
          order.reference
        } vient d'être acceptée.Pour plus d'informations, veuillez vous connectez à votre espace sur la plateforme SNB.`,
        action: {
          button: {
            color: '#22BC66',
            text: 'Se connecter',
            link: `${FRONT_APP_URL}`,
          },
        },
        outro:
          "Pour plus de renseignements, contactez nous à l'adresse suivante : contact@snb.io",
      },
    });
  },
};
