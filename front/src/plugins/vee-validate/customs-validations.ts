export default {
  validePassword: (password: string) => {
    const rules = [
      { message: "Une lettre majuscule", regex: /[A-Z]+/ },
      { message: "8 caractères minimum", regex: /.{8,}/ },
      { message: "Un chiffre", regex: /[0-9]+/ },
      {
        message: "Un caractère spécial(#?*+/@!)",
        regex: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
      },
    ];

    for (const rule of rules) {
      if (!rule.regex.test(password)) return "Mot de passe invalide";
    }

    return true;
  },

  confirmPassword: (value: string, args: any) => {
    console.log("arguments", args);
    if (value != args.password) return "Mots de passes non identiques";
    return true;
  },

  

  decimalNumber: (value: string, args: any) => {
    const re = /^\d*\.?\d+$/;
    if (!re.test(value)) return "Entré non valide";
    return true;
  },
};
