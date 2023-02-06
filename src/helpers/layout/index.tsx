import tailwindConfig from '../../../tailwind.config';

export const useTailwindScreenWidth = (
  screen: string
): { width: number; unit: string } => {
  // @ts-expect-error TS(2769): No overload matches this call.
  const screenData = Object.values(tailwindConfig.theme.screens[screen]).join(
    ''
  );

  return {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    width: Number(screenData.match(/[0-9*]/g).join('')), // e.g 123
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    unit: screenData.match(/[a-z*]/g).join('') // e.g "px"
  };
};
