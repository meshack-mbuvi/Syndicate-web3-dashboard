/* eslint-disable react/display-name */
import useWindowSize from '@/hooks/useWindowSize';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { CollectivesInteractiveBackground } from '../interactiveBackground';

export const GeneratedArtworkDarkBGColors = [
  'bg-red-hal',
  'bg-red-nasa-worm',
  'bg-red-f1-turbo',
  'bg-orange-aces-rescue-orange',
  'bg-orange-terra',
  'bg-red-penny',
  'bg-blue-neptune',
  'bg-blue-nasa-flight-cobalt',
  'bg-purple-ultraviolet',
  'bg-purple-neon',
  'bg-green-biomass',
  'bg-green-moss',
  'bg-green-standard-issue-od'
];

interface Props {
  captureRef?: MutableRefObject<HTMLButtonElement> | null;
  label?: string;
  backgroundColorClass?: string;
  hideParticles?: boolean;
  customId?: string;
  isForDisplay?: boolean; // Mark as true when creating an instance for display in the app, and not for image capture
}

export const CollectivesGeneratedArtwork: React.FC<Props> = React.forwardRef(
  ({
    captureRef,
    label,
    backgroundColorClass,
    customId,
    hideParticles = false
  }) => {
    const containerRef = useRef<HTMLButtonElement>(null);
    const containerPaddingRem = 2;
    const pxPerRem = 16;
    const titleRef = useRef(null);
    const [baseFontSize] = useState(34 / pxPerRem);
    const [fontSize, setFontSize] = useState(baseFontSize);
    const [previousLabelLength, setPreviousLabelLength] = useState(
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      label.length
    );
    const [previousWindowWidth, setPreviousWindowWidth] = useState(
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      label.length
    );
    const windowWidth = useWindowSize().width;
    const [shouldLabelShrinkIfNeeded, setShouldLabelShrinkIfNeeded] =
      useState(null);

    const ref = captureRef ? captureRef : containerRef;

    // Bump up or down the font size
    const adjustFontSize = () => {
      if (!ref.current) return;
      const heightOfContainer =
        ref.current.getBoundingClientRect().height -
        containerPaddingRem * pxPerRem * 3;
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      const heightOfTitle = titleRef.current.getBoundingClientRect().height;

      if (shouldLabelShrinkIfNeeded) {
        if (heightOfTitle > heightOfContainer) {
          setFontSize(fontSize - 0.0625 <= 0 ? 0.1 : fontSize - 0.0625);
        }
      } else if (!shouldLabelShrinkIfNeeded) {
        if (heightOfTitle < heightOfContainer) {
          setFontSize(
            fontSize + 0.0625 > baseFontSize ? baseFontSize : fontSize + 0.0625
          );
        }
      }
    };

    // Determine if the label is getting longer or shorter
    useEffect(() => {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      const currentLabelLength = label.length;
      if (currentLabelLength > previousLabelLength) {
        // @ts-expect-error TS(2345): Argument of type 'true' is not assig... Remove this comment to see the full error message
        setShouldLabelShrinkIfNeeded(true);
      } else {
        // @ts-expect-error TS(2345): Argument of type 'false' is not assig... Remove this comment to see the full error message
        setShouldLabelShrinkIfNeeded(false);
      }
      setPreviousLabelLength(currentLabelLength);
    }, [label]);

    // Determine if the window is growing or shrinking
    useEffect(() => {
      const currentWindowWidth = windowWidth;
      if (currentWindowWidth > previousWindowWidth) {
        // @ts-expect-error TS(2345): Argument of type 'false' is not assig... Remove this comment to see the full error message
        setShouldLabelShrinkIfNeeded(false);
      } else {
        // @ts-expect-error TS(2345): Argument of type 'true' is not assig... Remove this comment to see the full error message
        setShouldLabelShrinkIfNeeded(true);
      }
      setPreviousWindowWidth(currentWindowWidth);
    }, [windowWidth]);

    useEffect(() => {
      adjustFontSize();
    }, [label]);

    return (
      <button
        ref={captureRef ? captureRef : containerRef}
        className={`relative w-full h-full ${backgroundColorClass} text-left flex justify-center items-center overflow-hidden chromatic-ignore`}
      >
        <CollectivesInteractiveBackground
          heightClass="h-full"
          widthClass="w-full"
          numberOfParticles={hideParticles ? 0 : 55}
          isArtwork={true}
          customId={customId}
        />
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            padding: `${containerPaddingRem}rem`
          }}
        >
          <div
            ref={titleRef}
            className="relative uppercase text-white font-black-extended break-words"
            style={{
              fontSize: `${fontSize}rem`,
              lineHeight: '120%'
            }}
          >
            {label}
          </div>
        </div>
      </button>
    );
  }
);
