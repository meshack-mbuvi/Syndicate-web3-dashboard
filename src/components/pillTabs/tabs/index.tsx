import useWindowSize from '@/hooks/useWindowSize';
import { FC, useEffect, useRef, useState } from 'react';

interface Props {
  tabs: { name: string }[];
  activeIndex: number;
  handleTabChange: (index) => void;
}

const PillTabs: FC<Props> = ({ tabs, activeIndex, handleTabChange }) => {
  const { width } = useWindowSize();
  const [tabHighlightDimensions, setTabHighlightDimensions] = useState({
    left: 0,
    width: 10
  });
  const [tabHighlightAnimationStyles, setTabHighlightAnimationStyles] =
    useState('');

  useEffect(() => {
    // Calculate position and width of highlighted tab
    const left = tabRefs.current[activeIndex].getBoundingClientRect().x;
    const width = tabRefs.current[activeIndex].getBoundingClientRect().width;
    setTabHighlightDimensions({
      left: left - 32,
      width: width
    });

    // During page resizing, initial renders, or tab changes,
    // we don't want any animation
    setTabHighlightAnimationStyles('');
  }, [width, tabs]);

  const tabRefs = useRef([]);
  const renderedTabs = tabs.map((tab, index) => (
    <>
      <button
        className={`relative z-0 py-2 px-5 rounded-full ${
          activeIndex === index ? 'text-black' : 'text-white'
        } transition-all`}
        onClick={() => {
          handleTabChange(index);

          // Calculate position and width of highlighted tab
          const left = tabRefs.current[index].getBoundingClientRect().x;
          const width = tabRefs.current[index].getBoundingClientRect().width;
          setTabHighlightDimensions({ left: left - 32, width: width });

          // We only want an animation when changing the active tab.
          // Otherwise on resize or first render there is a distracting movement
          // to the initial position from the left corner
          setTabHighlightAnimationStyles(
            'transition-all duration-300 ease-out'
          );
        }}
        // Add each button in a list of refs
        ref={(ref) => {
          if (ref && !tabRefs.current.includes(ref)) {
            tabRefs.current.push(ref);
          }
        }}
        key={index}
      >
        {tab.name}
      </button>
    </>
  ));

  return (
    <div className="relative flex space-x-4 justify-center">
      {/* Tab buttons */}
      <div className="relative z-10">{renderedTabs}</div>

      {/* Highligted tab */}
      <div
        className={`absolute z-0 h-full w-8 ease-in-out rounded-full bg-white ${tabHighlightAnimationStyles}`}
        style={{
          width: `${tabHighlightDimensions.width}px`,
          left: `${tabHighlightDimensions.left}px`
        }}
      ></div>
    </div>
  );
};

export default PillTabs;
