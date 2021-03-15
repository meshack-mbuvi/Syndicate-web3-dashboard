const colors = require("tailwindcss/colors");

module.exports = {
  plugins: [require("@tailwindcss/forms")],
  purge: ["./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
        black: "#171717",
        // gray:""
      },
    },
    borderColor: (theme) => ({
      ...theme("colors"),
      DEFAULT: theme("colors.gray.300", "currentColor"),
      gray: "#5F5F5F",
    }),
    backgroundColor: (theme) => ({
      ...theme("colors"),
      gray: "#272727",
    }),
  },
};
