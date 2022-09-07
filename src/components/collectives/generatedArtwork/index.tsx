/* eslint-disable react/display-name */
import useWindowSize from '@/hooks/useWindowSize';
import React, { useEffect, useRef, useState } from 'react';
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
  captureRef?;
  label?: string;
  backgroundColorClass?: string;
  numberOfNodes?: number;
  customId?: string;
  isForDisplay?: boolean; // Mark as true when creating an instance for display in the app, and not for image capture
}

export const CollectivesGeneratedArtwork: React.FC<Props> = React.forwardRef(
  ({ captureRef, label, backgroundColorClass, customId }) => {
    const continerRef = useRef(null);
    const containerPaddingRem = 2;
    const pxPerRem = 16;
    const titleRef = useRef(null);
    const [baseFontSize] = useState(34 / pxPerRem);
    const [fontSize, setFontSize] = useState(baseFontSize);
    const [previousLabelLength, setPreviousLabelLength] = useState(
      label.length
    );
    const [previousWindowWidth, setPreviousWindowWidth] = useState(
      label.length
    );
    const windowWidth = useWindowSize().width;
    const [shouldLabelShrinkIfNeeded, setShouldLabelShrinkIfNeeded] =
      useState(null);

    // Bump up or down the font size
    const adjustFontSize = () => {
      const heightOfContainer =
        (captureRef ? captureRef : continerRef).current.getBoundingClientRect()
          .height -
        containerPaddingRem * pxPerRem * 3;
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
      const currentLabelLength = label.length;
      if (currentLabelLength > previousLabelLength) {
        setShouldLabelShrinkIfNeeded(true);
      } else {
        setShouldLabelShrinkIfNeeded(false);
      }
      setPreviousLabelLength(currentLabelLength);
    }, [label]);

    // Determine if the window is growing or shrinking
    useEffect(() => {
      const currentWindowWidth = windowWidth;
      if (currentWindowWidth > previousWindowWidth) {
        setShouldLabelShrinkIfNeeded(false);
      } else {
        setShouldLabelShrinkIfNeeded(true);
      }
      setPreviousWindowWidth(currentWindowWidth);
    }, [windowWidth]);

    useEffect(() => {
      adjustFontSize();
    }, [label]);

    return (
      <button
        ref={captureRef ? captureRef : continerRef}
        className={`relative w-full h-full ${backgroundColorClass} text-left flex justify-center items-center overflow-hidden`}
      >
        <CollectivesInteractiveBackground
          heightClass="h-full"
          widthClass="w-full"
          numberOfParticles={55}
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
