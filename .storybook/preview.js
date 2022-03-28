import { RouterContext } from "next/dist/shared/lib/router-context";
import "../src/styles/animation.css";
import "../src/styles/global.css";

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
    default: "black",
    values: [
      {
        name: "black",
        value: "black",
      },
      {
        name: "white",
        value: "white",
      },
    ],
  },
};

export const decorators = [
  (Story) => (
    <div className="text-white">
      <Story />
    </div>
  ),
];
