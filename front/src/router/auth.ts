import AuthLayout from "@/layouts/auth.vue";
import FirstLogin from "@/views/auth/firstLogin.vue";
import DefinePassword from "@/views/auth/definePassword.vue";
import Login from "@/views/auth/login.vue";
import ForgotPassword from "@/views/auth/forgotPassword.vue";

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
            "Veuillez entrer les identifiants (Email et mot de  passe) que vous avez reçu par email",
        },
      },
      {
        path: "",
        name: "login1",
        component: Login,
        meta: {
          title: "Connexion",
          subtitle:
            "Veuillez  vous connecter en renseignant votre adresse  gmail et votre mot de passe",
        },
      },
      {
        path: "/auth/login",
        name: "login",
        component: Login,
        meta: {
          title: "Connexion",
          subtitle:
            "Veuillez  vous connecter en renseignant votre adresse  gmail et votre mot de passe",
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
        path: "/auth/forgotPassword",
        name: "forgotPassword",
        component: ForgotPassword,
        meta: {
          title: "Réinitialisation du mot de passe",
          subtitle: "",
        },
      },
    ],
  },
];
