const colors = require("tailwindcss/colors");

module.exports = {
  plugins: [require("@tailwindcss/forms")],
  purge: ["./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
        black: "#171717",
        gray: {
          ...colors.coolGray,
          85: "#d9d9d9",
          90: "#5F5F5F",
          99: "#fcfcfc",
          dark: "#272727",
          light: "#E5E5E5",
        },
        blue: {
          ...colors.blue,
          light: "#35cfff",
        },
      },
      fill: (theme) => ({
        gray: theme("colors.gray.light"),
      }),
    },
  },
};
