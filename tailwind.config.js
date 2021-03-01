const colors = require("tailwindcss/colors");

// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  purge: ["./src/**/*.js"],
  // https://github.com/tailwindlabs/tailwindcss-forms
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/forms")],
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
        black: "#171717",
      },
    },
    borderColor: (theme) => ({
      ...theme("colors"),
      DEFAULT: theme("colors.gray.300", "currentColor"),
      gray: "#5F5F5F",
    }),
  },
};
