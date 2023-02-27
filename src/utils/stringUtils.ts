export const countOccurrences = (arr: string[], val: string) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export const removeNewLinesAndWhitespace = (value: string): string =>
  value.replace(/\r?\n|\r|\s/g, '');

export const removeSubstring = (
  originalString: string,
  subString: string
): string => {
  const start = originalString.indexOf(subString);
  return (
    originalString.substr(0, start) +
    originalString.substr(start + subString.length)
  );
};

export const getFirstOrString = (
  param: string | string[] | undefined
): string | undefined => {
  if (!param) return;

  if (typeof param === 'string') {
    return param;
  }

  return param[0];
};
