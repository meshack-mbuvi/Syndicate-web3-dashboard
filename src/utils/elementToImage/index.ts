import domtoimage from 'dom-to-image';

/** Export a snapshot PNG of a component
 * @param captureRef a reference to the element you want to convert to an image
 * @param scale multiply the image size
 * */

export const elementToImage = (
  captureRef,
  scale: number,
  handleCapture: (imageURI: string) => void
) => {
  const element = captureRef.current;
  domtoimage
    .toPng(element, {
      height: element.offsetHeight * scale,
      width: element.offsetWidth * scale,
      style: {
        transform: 'scale(' + scale + ')',
        transformOrigin: 'top left',
        width: element.offsetWidth + 'px',
        height: element.offsetHeight + 'px'
      }
    })
    .then(handleCapture);
};
