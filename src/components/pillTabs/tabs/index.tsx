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
    x: 0,
    width: 10
  });
  const [tabHighlightAnimationStyles, setTabHighlightAnimationStyles] = useState('');
  const tabContainer = useRef(null);

  const calculateHighlightDimensions = (index: number) => {

    // Calculate position and width of tab
    const tabX = tabRefs.current[index].getBoundingClientRect().x;
    const tabWidth = tabRefs.current[index].getBoundingClientRect().width;
    
    // Calculate position of tab container
    const containerX = tabContainer ? tabContainer.current.getBoundingClientRect().x : 0;
    return {x: tabX - containerX, width: tabWidth}
  }

  useEffect(() => {

    // Calculate position and width of highlighted tab
    setTabHighlightDimensions(calculateHighlightDimensions(activeIndex));

    // During page resizing, initial renders, or tab changes,
    // we don't want any animation
    setTabHighlightAnimationStyles('');
  }, [width, tabs]);

  const tabRefs = useRef([]);
  const renderedTabs = tabs.map((tab, index) => (
    <>
      <button
        key={index}
        className={`relative z-0 py-2 px-5 rounded-full ${
          activeIndex === index ? 'text-black' : 'text-white'
        } transition-all`}
        onClick={() => {
          handleTabChange(index);

          // Calculate position and width of highlighted tab
          setTabHighlightDimensions(calculateHighlightDimensions(index));

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
      >
        {tab.name}
      </button>
    </>
  ));

  return (
    <div 
      ref={tabContainer}
      className="relative flex space-x-4 justify-center"
    >
      {/* Tab buttons */}
      <div className="relative z-10">
        {renderedTabs}
      </div>

      {/* Highligted tab */}
      <div
        className={`absolute z-0 h-full ease-in-out rounded-full bg-white ${tabHighlightAnimationStyles}`}
        style={{
          width: `${tabHighlightDimensions.width}px`,
          left: `calc(${tabHighlightDimensions.x}px - 1rem)`
        }}
      ></div>
    </div>
  );
};

export default PillTabs;
