const countOccurrences = (arr: string[], val: string) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export default countOccurrences;
