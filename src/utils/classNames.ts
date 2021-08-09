export const classNames = (...classes: Array<string>): string => {
  return classes.filter(Boolean).join(' ')
};
