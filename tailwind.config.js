const colors = require("tailwindcss/colors");

module.exports = {
  plugins: [require("@tailwindcss/forms")],
  purge: ["./src/**/*.js"],
  theme: {
    extend: {
      height: (theme) => ({
        "fit-content": "fit-content",
      }),
      fontFamily: {
        ibm: ["IBM Plex Mono"],
      },
      colors: {
        cyan: colors.cyan,
        gray: {
          ...colors.coolGray,
          7: "#121212",
          9: "#171717",
          24: "#3D3D3D",
          49: "#7D7D7D",
          85: "#d9d9d9",
          90: "#5F5F5F",
          99: "#fcfcfc",
          dark: "#272727",
          light: "#E5E5E5",
          dim: "#717171",
          nero: "#252525",
        },
        green: {
          ...colors.green,
          screamin: "#80FF75",
        },
        blue: {
          ...colors.blue,
          light: "#35cfff",
          cyan: "#2AA3EF",
        },
      },
      fill: (theme) => ({
        gray: theme("colors.gray.light"),
      }),
    },
  },
};
