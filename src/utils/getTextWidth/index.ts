// Use canvas to determine text width
export const getTextWidth = (text) => {
  const canvas = document?.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = getComputedStyle(document.body).font;
  return context.measureText(text).width;
};
