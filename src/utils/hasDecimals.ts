export const hasDecimals = (value: number): boolean =>
  Math.floor(value) !== +value;
