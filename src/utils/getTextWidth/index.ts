// Use canvas to determine text width
export const getTextWidth = (text: string, font?: string): number => {
  // @ts-expect-error TS(2322): Type 'undefined' is not assignable to type 'number... Remove this comment to see the full error message
  if (typeof document === 'undefined') return;
  const canvas = document?.createElement('canvas');
  const context = canvas.getContext('2d');
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  context.font = font || getComputedStyle(document.body).font;
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  return context.measureText(text).width;
};
