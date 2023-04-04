import AuthLayout from "@/layouts/auth.vue";
import FirstLogin from "@/views/auth/firstLogin.vue";
import DefinePassword from "@/views/auth/definePassword.vue";
import Login from "@/views/auth/login.vue";
import ForgotPassword from "@/views/auth/forgotPassword.vue";
import PasswordCode from "@/views/auth/code.vue";

export default [
  {
    path: "",
    component: AuthLayout,
    children: [
      {
        path: "/auth",
        name: "firstLogin",
        component: FirstLogin,
        meta: {
          title: "Bienvenue sur la plateforme SNB",
          subtitle:
            "Veuillez entrer les identifiants (Mail et mot de  passe) que vous avez reçu par mail",
        },
      },
      {
        path: "",
        name: "login1",
        component: Login,
        meta: {
          title: "Connexion",
          subtitle:
            "Veuillez  vous connecter en renseignant votre mail et votre mot de passe",
        },
      },
      {
        path: "/auth/login",
        name: "login",
        component: Login,
        meta: {
          title: "Connexion",
          subtitle:
            "Veuillez  vous connecter en renseignant votre mail et votre mot de passe",
        },
      },
      {
        path: "/auth/definePassword",
        name: "definePassword",
        component: DefinePassword,
        meta: {
          title: "Création de mot de passe",
          subtitle: "Veuillez définir et confirmer votre <br> mot de passe",
        },
      },
      {
        path: "/auth/definePassword",
        name: "newPassword",
        component: DefinePassword,
        meta: {
          title: "Nouveau mot de passe",
          subtitle: "Veuillez définir et confirmer votre <br> nouveau mot de passe",
        },
      },
      {
        path: "/auth/forgotPassword",
        name: "forgotPassword",
        component: ForgotPassword,
        meta: {
          title: "Réinitialisation du mot de passe",
          subtitle: "",
        },
      },
      {
        path: "/auth/password/code",
        name: "passwordCode",
        component: PasswordCode,
        meta: {
          title: "Réinitialisation de mot de passe",
        },
      },
    ],
  },
];
