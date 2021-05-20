const colors = require("tailwindcss/colors");

module.exports = {
  plugins: [require("@tailwindcss/forms")],
  purge: false,
  theme: {
    extend: {
      height: () => ({
        "fit-content": "fit-content",
      }),
      width: () => ({
        "fit-content": "fit-content",
      }),
      fontFamily: {
        whyte: ["ABC Whyte Regular", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        cyan: colors.cyan,
        gray: {
          ...colors.coolGray,
          6: "#101010",
          7: "#121212",
          9: "#171717",
          24: "#3D3D3D",
          49: "#7D7D7D",
          85: "#d9d9d9",
          90: "#5F5F5F",
          93: "#EDEDED",
          99: "#fcfcfc",
          dark: "#272727",
          light: "#E5E5E5",
          dim: "#717171",
          nero: "#252525",
          manatee: "#8F97AB",
          matterhorn: "#515151",
          nightrider: "#353535",
        },
        green: {
          ...colors.green,
          screamin: "#80FF75",
        },
        blue: {
          ...colors.blue,
          light: "#35cfff",
          cyan: "#2AA3EF",
          deepAzure: "#0C1F30",
          dark: "#11ACDC",
        },
        yellow: {
          ...colors.yellow,
          light: "#FFD02B",
        },
      },
      fill: (theme) => ({
        gray: theme("colors.gray.light"),
      }),
    },
  },
};
