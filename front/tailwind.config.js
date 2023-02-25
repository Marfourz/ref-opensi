/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#095741",
        success: "#28C75D",
        danger: "#DA1414",
        warning: "#D96C19",
        yellow: "#F9C541",
        fadePrimary: "#EDF9F0",
        fadeSucces: "#E9F9EF",
        fadeDanger: "#FEEFEF",
        fadeWarning: "#FCF1E8",
        fadeYellow: "#F9C541",
        borderColor: "#D3D8E6",
        link: "#0047FF",
        tableColor: "#6B7A99",
        grey: {
          20: "#DADEE3",
          50: "#6D7580",
          70: "#394452",
        },
        green: "#259475",
      },
      borderRadius: {
        40:"40px",
      },
    },
  },
  plugins: [],
};
