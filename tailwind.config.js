// eslint-disable-next-line @typescript-eslint/no-var-requires
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
      borderWidth: ["first", "last", "hover"],
      ringWidth: ["hover", "active"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "1680px",
          paddingLeft: "6%",
          paddingRight: "6%",
          "@screen sm": {
            maxWidth: "640px",
            paddingLeft: "3rem",
            paddingRight: "3rem",
          },
          "@screen md": {
            maxWidth: "900px",
            paddingLeft: "3rem",
            paddingRight: "3rem",
          },
          "@screen lg": {
            maxWidth: "1480px",
            paddingLeft: "4rem",
            paddingRight: "4rem",
          },
          "@screen xl": {
            maxWidth: "1680px",
            paddingLeft: "100px",
            paddingRight: "100px",
          },
        },
      });
    },
  ],
  purge: false,
  theme: {
    rotate: {
      135: "135deg",
      45: "45deg",
      "-45": "-45deg",
    },
    screens: {
      sm: "640px",
      md: "868px",
      lg: "1024px",
      "1.5lg": "1152px",
      xl: "1280px",
      "1.5xl": "1480px",
      "2xl": "1536px",
      "3xl": "1900px",
      "4xl": "2500px",
    },
    extend: {
      zIndex: {
        8: "8",
      },
      height: () => ({
        "fit-content": "fit-content",
        4.5: "1.125rem",
        17.5: "4.375rem",
        18: "4.5rem",
        104: "26rem",
        202: "50.5rem",
      }),
      width: () => ({
        "fit-content": "fit-content",
        "2/1": "200%",
        100: "30rem",
        "slightly-over-100": "30.25rem",
      }),
      maxWidth: {
        564: "35.25rem",
        868: "54rem",
        1480: "92.5rem",
      },
      maxHeight: {
        104: "26rem",
        816: "50.5rem",
      },
      backgroundOpacity: {
        15: "0.15",
      },
      fontFamily: {
        whyte: ["Whyte Regular", "Helvetica", "Arial", "sans-serif"],
        "whyte-extralight": [
          "Whyte Thin Trial",
          "Whyte Regular",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        "whyte-light": [
          "Whyte Light Trial",
          "Whyte Regular",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        "whyte-medium": [
          "Whyte Medium",
          "Whyte Regular",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        modalTitle: "2.1875rem",
        modalSubTitle: "1.5rem",
        "1.5xl": "1.375rem",
        "2.5xl": "1.75rem",
        "4xl": ["2.25rem", "2.75rem"],
        "4.5xl": "2.5rem",
        "5xl": ["3rem", "3.5rem"],
        "6xl": ["3.75rem", "4.25rem"],
        "7xl": ["4.5rem", "5.4rem"],
      },
      lineHeight: {
        17: "4.25rem",
      },
      colors: {
        "twitter-blue": "#1DA1F2",
        "discord-purple": "#7289DA",
        "telegram-blue": "#37AEE2",
        cyan: colors.cyan,
        gray: {
          ...colors.coolGray,
          syn1: "#F1F3F7",
          syn2: "#D9DDE5",
          syn3: "#B8BDC7",
          syn4: "#90949E",
          syn5: "#646871",
          syn6: "#3F4147",
          syn7: "#232529",
          syn8: "#131416",
          syn9: "#0B0C0D",
          2: "#D9DDE5",
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
          102: "#141518",
          cod: "#131313",
          dark: "#272727",
          light: "#E5E5E5",
          dim: "#717171",
          dimmer: "#777777",
          nero: "#252525",
          manatee: "#8F97AB",
          lightManatee: "#90949E",
          matterhorn: "#515151",
          nightrider: "#353535",
          inactive: "#30363A",
          inactiveText: "#505050",
          placeholder: "#666666",
          erieBlack: "#1B1B1B",
          blackRussian: "#141518",
          darkBackground: "#151618",
          darkInput: "#2C2C2F",
          steelGrey: "#3F4147",
          shark: "#272829",
          lightSlate: "#808F9C",
          spindle: "#B8BDC7",
          shuttle: "#646871",
        },
        red: {
          ...colors.red,
          semantic: "#F14D4D",
        },
        green: {
          ...colors.green,
          DEFAULT: "#30E696",
          screamin: "#80FF75",
          light: "#2FE696",
          dark: "#0E2833",
          darker: "#0E3425",
          success: "#0D3325",
          "light-dark": "#01A979",
          "light-darker": "#02504B",
        },
        blue: {
          ...colors.blue,
          light: "#35cfff",
          cyan: "#2AA3EF",
          DEFAULT: "#4376FF",
          deepAzure: "#0C1F30",
          dark: "#2F53B3",
          darker: "#0E1834",
          neon: "#0029FF",
          "light-dark": "#237EFF",
          "light-darker": "#000AFF",
          navy: "#4376FF",
          rockBlue: "#8F9CAB",
          melanie: "#BDCFE3",
          darkGunMetal: "#232529",
          midnightExpress: "#0D1833",
        },
        yellow: {
          ...colors.yellow,
          light: "#FFD02B",
          dark: "#FFC83C",
          semantic: "#F9D252",
          saffron: "#FFA439",
        },
        orange: {
          ...colors.orange,
          light: "#E7AC3A",
          dark: "#E78B3A",
        },
      },
      borderWidth: {
        1: "1px",
      },
      borderColor: {
        inactive: "#30363A",
      },
      spacing: {
        "1px": "1px",
        33: "8.5rem",
        50: "12.5rem",
        66: "16.5rem",
        68: "17rem",
        76: "19rem",
        102: "30rem",
      },
      fill: (theme) => ({
        gray: theme("colors.gray.light"),
      }),
      scale: {
        101: "1.01",
        102: "1.02",
      },
      animation: {
        fade_in: "fade_in 0.5s ease-out 1",
        fade_in_bg: "fade_in_bg 6s ease-out 1",
      },
      keyframes: {
        fade_in: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fade_in_bg: {
          "0%": {
            backgroundOpacity: "0.3",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      inset: {
        84: "22rem",
      },
      margin: {
        0.5: "0.15rem",
        24.5: "6.5rem",
      },
      padding: {
        4.5: "1.125rem",
      },
    },
  },
};
