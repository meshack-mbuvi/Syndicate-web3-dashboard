import { B3 } from '@/components/typography';
import useWindowSize from '@/hooks/useWindowSize';
import { FC, useEffect, useRef, useState } from 'react';

interface Props {
  tabs: { label?: string | JSX.Element; icon?: string }[];
  activeIndex: number;
  handleTabChange: (index: any) => void;
  extraClasses?: string;
}

const SegmentedControl: FC<Props> = ({
  tabs,
  activeIndex,
  handleTabChange,
  extraClasses
}) => {
  const { width } = useWindowSize();
  const [tabHighlightDimensions, setTabHighlightDimensions] = useState({
    x: 0,
    width: 10
  });
  const [tabHighlightAnimationStyles, setTabHighlightAnimationStyles] =
    useState('');
  const tabContainer = useRef(null);

  const calculateHighlightDimensions = (index: number) => {
    // Calculate position and width of tab
    // @ts-expect-error TS(2339): Property 'getBoundingClientRect' does not exist on... Remove this comment to see the full error message
    const tabX = tabRefs.current[index].getBoundingClientRect().x;
    // @ts-expect-error TS(2339): Property 'getBoundingClientRect' does not exist on... Remove this comment to see the full error message
    const tabWidth = tabRefs.current[index].getBoundingClientRect().width;

    // Calculate position of tab container
    const containerX = tabContainer.current
      ? // @ts-expect-error TS(2339): Property 'getBoundingClientRect' does not exist on... Remove this comment to see the full error message
        tabContainer.current.getBoundingClientRect().x
      : 0;
    return { x: tabX - containerX, width: tabWidth };
  };

  useEffect(() => {
    // Calculate position and width of highlighted tab
    setTabHighlightDimensions(calculateHighlightDimensions(activeIndex));

    // During page resizing, initial renders, or tab changes,
    // we don't want any animation
    setTabHighlightAnimationStyles('');
  }, [width]);

  useEffect(() => {
    // Calculate position and width of highlighted tab
    setTabHighlightDimensions(calculateHighlightDimensions(activeIndex));
  }, [activeIndex]);

  const tabRefs = useRef([]);
  const renderedTabs = tabs.map((tab, index) => (
    <button
      key={index}
      className={`h-full bg-opacity-50 overflow-hidden relative z-0 py-1.25 px-6 rounded-full ${
        activeIndex === index ? 'text-black' : 'text-white'
      } transition-all`}
      onClick={() => {
        handleTabChange(index);

        // We only want an animation when changing the active tab.
        // Otherwise on resize or first render there is a distracting movement
        // to the initial position from the left corner
        setTabHighlightAnimationStyles('transition-all duration-300 ease-out');
      }}
      // Add each button in a list of refs
      ref={(ref) => {
        // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
        if (ref && !tabRefs.current.includes(ref)) {
          // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
          tabRefs.current.push(ref);
        }
      }}
    >
      {typeof tab.label === 'string' ? <B3>{tab.label}</B3> : tab.label}
    </button>
  ));

  return (
    <div
      className={`border border-gray-syn6 rounded-full p-1 inline-flex ${
        extraClasses ?? ''
      }`}
    >
      <div
        ref={tabContainer}
        className="relative inline-flex space-x-4 justify-center"
      >
        {/* Tab buttons */}
        <div className="relative z-10 h-full">{renderedTabs}</div>

        {/* Highligted tab */}
        <div
          className={`absolute z-0 h-full ease-in-out rounded-full bg-white ${tabHighlightAnimationStyles}`}
          style={{
            width: `${tabHighlightDimensions.width}px`,
            left: `calc(${tabHighlightDimensions.x}px - 1rem)`
          }}
        ></div>
      </div>
    </div>
  );
};

export default SegmentedControl;
