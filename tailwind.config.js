// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  corePlugins: {
    container: false
  },
  variants: {
    extend: {
      padding: ['last', 'hover'],
      margin: ['hover'],
      backgroundColor: ['active'],
      backgroundOpacity: ['active'],
      borderRadius: ['first', 'last'],
      borderWidth: ['first', 'last', 'hover'],
      ringWidth: ['hover', 'active']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '1680px',
          paddingLeft: '6%',
          paddingRight: '6%',
          '@screen sm': {
            maxWidth: '640px',
            paddingLeft: '3rem',
            paddingRight: '3rem'
          },
          '@screen md': {
            maxWidth: '900px',
            paddingLeft: '3rem',
            paddingRight: '3rem'
          },
          '@screen lg': {
            maxWidth: '1480px',
            paddingLeft: '4rem',
            paddingRight: '4rem'
          },
          '@screen xl': {
            maxWidth: '1680px',
            paddingLeft: '100px',
            paddingRight: '100px'
          }
        }
      });
    }
  ],
  purge: false,
  theme: {
    rotate: {
      135: '135deg',
      45: '45deg',
      '-45': '-45deg'
    },
    screens: {
      sm: '640px',
      md: '868px',
      lg: '1024px',
      '1.2lg': '1098px',
      '1.5lg': '1152px',
      xl: '1280px',
      '1.5xl': '1480px',
      '2xl': '1536px',
      '3xl': '1900px',
      '4xl': '2500px'
    },
    extend: {
      opacity: {
        25: '.25',
        85: '.85'
      },
      zIndex: {
        8: '8',
        15: 15,
        60: 60
      },
      height: () => ({
        'fit-content': 'fit-content',
        4.5: '1.125rem',
        13: '3.25rem',
        17.5: '4.375rem',
        18: '4.5rem',
        88: '22rem',
        100: '30rem',
        104: '26rem',
        202: '50.5rem',
        '2screen': '200vh'
      }),
      width: () => ({
        'fit-content': 'fit-content',
        '2/1': '200%',
        '5.21/12': '43.47826%',
        7.5: '1.875rem',
        62: '15.5rem',
        88: '22rem',
        100: '30rem',
        104: '26rem',
        'slightly-over-100': '30.25rem',
        500: '31.25rem',
        564: '35.25rem',
        730: '45.625rem'
      }),
      minWidth: {
        50: '12.5rem'
      },
      maxWidth: {
        480: '30rem',
        564: '35.25rem',
        868: '54rem',
        1480: '92.5rem',
        '5.5xl': '69rem'
      },
      maxHeight: {
        25: '6.125',
        104: '26rem',
        480: '30rem',
        816: '50.5rem',
        screen: '100vh',
        '2screen': '200vh'
      },
      backgroundOpacity: {
        15: '0.15'
      },
      fontFamily: {
        whyte: ['Whyte Regular', 'Helvetica', 'Arial', 'sans-serif'],
        'whyte-extralight': [
          'Whyte Thin Trial',
          'Whyte Regular',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        'whyte-light': [
          'Whyte Light Trial',
          'Whyte Regular',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        'whyte-medium': [
          'Whyte Medium',
          'Whyte Regular',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: ['Whyte Semi-Mono'],
        bold: ['Whyte Bold']
      },
      fontSize: {
        subtext: ['0.75rem', '0.875rem'],
        modalTitle: '2.1875rem',
        modalSubTitle: '1.5rem',
        '1.5xl': '1.375rem',
        '2.5xl': '1.75rem',
        '4xl': ['2.25rem', '2.75rem'],
        '4.5xl': '2.5rem',
        '5xl': ['3rem', '3.5rem'],
        '5.75xl': '1.375',
        '6xl': ['3.75rem', '4.25rem'],
        '7xl': ['4.5rem', '5.4rem']
      },
      lineHeight: {
        4.5: '1.125rem',
        4.75: '1.1875rem',
        5.5: '1.3125rem',
        5.75: '1.375',
        7.5: '1.875rem',
        9: '2.25rem',
        11.5: '2.875rem',
        17: '4.25rem'
      },
      letterSpacing: {
        px: '0.0625rem',
        '2.5xl': '1.25rem'
      },
      colors: {
        'twitter-blue': '#1DA1F2',
        'discord-purple': '#7289DA',
        'telegram-blue': '#37AEE2',
        cyan: {
          ...colors.cyan,
          cherenkov: '#00FFFF',
          verdigris: '#43B3AE'
        },
        purple: {
          ...colors.purple,
          ultraviolet: '#5551FF',
          neon: '#7000FF'
        },
        pink: {
          ...colors.pink,
          millenium: '#FF94FF'
        },
        gray: {
          ...colors.coolGray,
          syn1: '#F1F3F7',
          syn2: '#D9DDE5',
          syn3: '#B8BDC7',
          syn4: '#90949E',
          syn5: '#646871',
          syn6: '#3F4147',
          syn7: '#232529',
          syn8: '#131416',
          syn9: '#0B0C0D',
          syn10: '#A8AFBD',
          2: '#D9DDE5',
          3: '#A8AFBD',
          4: '#1B1D20',
          5: '#292929',
          6: '#101010',
          7: '#121212',
          9: '#171717',
          24: '#3D3D3D',
          49: '#7D7D7D',
          85: '#d9d9d9',
          90: '#5F5F5F',
          93: '#EDEDED',
          99: '#fcfcfc',
          102: '#141518',
          border: '#494949',
          cod: '#131313',
          dark: '#272727',
          light: '#E5E5E5',
          dim: '#717171',
          dimmer: '#777777',
          nero: '#252525',
          manatee: '#8F97AB',
          lightManatee: '#90949E',
          matterhorn: '#515151',
          nightrider: '#353535',
          inactive: '#30363A',
          inactiveText: '#505050',
          placeholder: '#666666',
          erieBlack: '#1B1B1B',
          blackRussian: '#141518',
          darkBackground: '#151618',
          darkInput: '#2C2C2F',
          steelGrey: '#3F4147',
          shark: '#272829',
          lightSlate: '#808F9C',
          spindle: '#B8BDC7',
          shuttle: '#646871',
          mineral: '#BEC8CF'
        },
        red: {
          ...colors.red,
          error: '#F14D4D',
          'nasa-worm': '#CB0020',
          'f1-turbo': '#F10000',
          hal: '#76151D',
          penny: '#AC6048'
        },
        green: {
          ...colors.green,
          DEFAULT: '#30E696',
          semantic: '#30E696',
          shine: '#64ECB0',
          screamin: '#80FF75',
          light: '#2FE696',
          dark: '#0E2833',
          darker: '#0E3425',
          success: '#0D3325',
          midnight: '#091703',
          biomass: '#355104',
          'light-dark': '#01A979',
          'light-darker': '#02504B',
          'phthalo-green': '#082B1E',
          volt: '#CCFF00',
          money: '#00F252',
          mint: '#CCFFCC',
          'standard-issue-od': '#191E12'
        },
        blue: {
          ...colors.blue,
          light: '#35cfff',
          cyan: '#2AA3EF',
          DEFAULT: '#4376FF',
          deepAzure: '#0C1F30',
          dark: '#2F53B3',
          darker: '#0E1834',
          'nasa-flight-cobalt': '#0029FF',
          'light-dark': '#237EFF',
          'light-darker': '#000AFF',
          navy: '#4376FF',
          rockBlue: '#8F9CAB',
          melanie: '#BDCFE3',
          gunMetal: '#0D2833',
          darkGunMetal: '#232529',
          midnightExpress: '#0D1833',
          oxfordBlue: '#0D1833',
          neptune: '#4376FF',
          tycho: '#29647E',
          liquidity: '#1FBBEC',
          stratosphere: '#A4DEFF'
        },
        yellow: {
          ...colors.yellow,
          light: '#FFD02B',
          dark: '#FFC83C',
          semantic: '#F9D252',
          warning: '#FFA439',
          highlight: '#FFD252',
          saffron: '#FFA439'
        },
        orange: {
          ...colors.orange,
          light: '#E7AC3A',
          dark: '#E78B3A',
          utopia: '#FFB80D',
          bullion: '#D28B01',
          'aces-rescue-orange': '#FF4E21',
          terra: '#D96E0B'
        },
        brown: {
          ...colors.brown,
          dark: '#261909',
          clay: '#AFA07F'
        }
      },
      borderWidth: {
        1: '1px'
      },
      borderColor: {
        inactive: '#30363A'
      },
      spacing: {
        '1px': '1px',
        7.5: '1.875rem',
        33: '8.5rem',
        50: '12.5rem',
        66: '16.5rem',
        68: '17rem',
        76: '19rem',
        82: '22.188rem', // NFT card size
        102: '30rem'
      },
      fill: (theme) => ({
        gray: theme('colors.gray.light')
      }),
      scale: {
        101: '1.01',
        102: '1.02'
      },
      animation: {
        fade_in: 'fade_in 0.5s ease-out 1',
        fade_in_bg: 'fade_in_bg 6s ease-out 1',
        'grow-shrink': 'grow-shrink 3.6s ease-in-out infinite'
      },
      keyframes: {
        fade_in: {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        fade_in_bg: {
          '0%': {
            backgroundOpacity: '0.3'
          },
          '100%': {
            opacity: '1'
          }
        },
        'grow-shrink': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.12)',
            opacity: '0.5'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        }
      },
      inset: {
        84: '22rem',
        31: '7.5rem',
        18: '4.5rem',
        25: '6.2rem',
        71: '17.3rem'
      },
      margin: {
        4.5: '1.125rem',
        0.5: '0.15rem',
        18: '4.875rem',
        24.5: '6.5rem',
        25.5: '6.25rem',
        27: '6.875rem'
      },
      padding: {
        4.5: '1.125rem',
        25.5: '6.25rem',
        25: '6.35rem',
        26: '6.6rem',
        '6-percent': '6%'
      },
      borderRadius: {
        '1.5lg': '0.625rem',
        '2.5xl': '1.25rem',
        '4xl': '2rem'
      },
      transitionProperty: {
        height: 'height'
      }
    }
  }
};
