export const NOTIFICATION_MESSAGES = {
  registrationMail: (data) => {
    return `Vous venez de vous inscrire voici votre nom d'utilisateur : ${data.username} cliquez sur ce lien pour définir votre mot de passe : http://localhost:5500/auth/definePassword/${data.token}`;
  },
};
