import domtoimage from 'dom-to-image';
import { MutableRefObject } from 'react';

/** Export a snapshot PNG of a component
 * @param captureRef a reference to the element you want to convert to an image
 * @param scale multiply the image size
 * */

export const elementToImage = async (
  captureRef: MutableRefObject<HTMLButtonElement | HTMLDivElement | null>,
  scale: number
): Promise<string> => {
  const element = captureRef.current;
  if (!element) throw new Error('No element to capture');
  return domtoimage.toPng(element, {
    height: element.offsetHeight * scale,
    width: element.offsetWidth * scale,
    style: {
      transform: 'scale(' + scale + ')',
      transformOrigin: 'top left',
      width: element.offsetWidth + 'px',
      height: element.offsetHeight + 'px'
    }
  });
};
