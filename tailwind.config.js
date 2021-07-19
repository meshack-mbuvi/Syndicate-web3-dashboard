const colors = require("tailwindcss/colors");

module.exports = {
  corePlugins: {
    container: false,
  },
  variants: {
    extend: {
      padding: ["last"],
      backgroundColor: ["active"],
      backgroundOpacity: ["active"],
      borderRadius: ["first", "last"],
      borderWidth: ["first", "last"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "100%",
          paddingLeft: "2%",
          paddingRight: "2%",
          "@screen sm": {
            maxWidth: "640px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
          "@screen md": {
            maxWidth: "900px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
          "@screen lg": {
            maxWidth: "1280px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
          "@screen xl": {
            maxWidth: "1400px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
          "@screen 3xl": {
            maxWidth: "1800px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
        },
      });
    },
  ],
  purge: false,
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      "1.5lg": "1152px",
      // => @media (min-width: 1152px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "1.5xl": "1408px",
      // => @media (min-width: 1408px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1900px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      height: () => ({
        "fit-content": "fit-content",
      }),
      width: () => ({
        "fit-content": "fit-content",
      }),
      maxWidth: {
        868: "54rem",
      },
      fontFamily: {
        whyte: ["ABC Whyte Regular", "Helvetica", "Arial", "sans-serif"],
        "whyte-extralight": [
          "ABC Whyte Inktrap Extralight",
          "ABC Whyte Regular",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        "whyte-light": [
          "ABC Whyte Inktrap Light",
          "ABC Whyte Regular",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        "whyte-medium": [
          "ABC Whyte Inktrap Light",
          "ABC Whyte Regular",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        modalTitle: "2.1875rem",
        modalSubTitle: "1.5rem",
        "2.5xl": "1.75rem",
      },
      colors: {
        cyan: colors.cyan,
        gray: {
          ...colors.coolGray,
          3: "#A8AFBD",
          4: "#1B1D20",
          5: "#292929",
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
          dark: "#0E2833",
          darker: "#0E3425",
        },
        blue: {
          ...colors.blue,
          light: "#35cfff",
          cyan: "#2AA3EF",
          DEFAULT: "#4376FF",
          deepAzure: "#0C1F30",
          dark: "#2F53B3",
          darker: "#0E1834",
        },
        yellow: {
          ...colors.yellow,
          light: "#FFD02B",
        },
      },
      borderWidth: {
        1: "1px",
      },
      spacing: {
        33: "8.5rem",
        50: "12.5rem",
        66: "16.5rem",
        68: "17rem",
        76: "19rem",
      },
      fill: (theme) => ({
        gray: theme("colors.gray.light"),
      }),
      scale: {
        101: "1.01",
        102: "1.02",
      },
      inset: {
        "84": "22rem",
      },
    },
  },
};
