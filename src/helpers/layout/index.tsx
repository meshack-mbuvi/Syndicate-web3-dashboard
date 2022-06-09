import tailwindConfig from 'tailwind.config';

export const useTailwindScreenWidth = (
  screen: string
): { width: number; unit: string } => {
  const screenData = Object.values(tailwindConfig.theme.screens[screen]).join(
    ''
  );

  return {
    width: Number(screenData.match(/[0-9*]/g).join('')), // e.g 123
    unit: screenData.match(/[a-z*]/g).join('') // e.g "px"
  };
};

export const useTailwindContainer = () => {
  const containerData = tailwindConfig.corePlugins.container;

  return containerData;
};
