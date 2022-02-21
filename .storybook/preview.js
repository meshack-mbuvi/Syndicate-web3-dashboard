import '../src/styles/global.css'
import { RouterContext } from "next/dist/shared/lib/router-context";


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
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