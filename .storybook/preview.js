import '../src/styles/global.css'


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'black',
    values: [
      {
        name: 'black',
        value: 'black',
      },
      {
        name: 'white',
        value: 'white',
      },
    ],
  },
  // backgrounds: [{ name: 'dark', value: '#33354C', default: true }],

}