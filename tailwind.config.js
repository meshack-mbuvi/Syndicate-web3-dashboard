const colors = require("tailwindcss/colors");

module.exports = {
  corePlugins: {
    container: false
  },
  variants: {
    extend: {
      padding: ['last'],
      backgroundColor: ['active'],
      backgroundOpacity: ['active'],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          paddingLeft: '2%',
          paddingRight: '2%',
          '@screen sm': {
            maxWidth: '640px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen md': {
            maxWidth: '900px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen lg': {
            maxWidth: '1280px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen xl': {
            maxWidth: '1400px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen 3xl': {
            maxWidth: '1800px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
        }
      })
    }
  ],
  purge: false,
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }

      '3xl': '1900px',
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
      borderWidth: {
        1: "1px",
      },
      spacing: {
        33: "8.5rem",
      },
      fill: (theme) => ({
        gray: theme("colors.gray.light"),
      }),
    },
  },
};
