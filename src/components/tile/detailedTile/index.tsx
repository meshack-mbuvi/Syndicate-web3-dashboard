import useWindowSize from '@/hooks/useWindowSize';
import React from 'react';

interface Props {
  options: { icon: string; title: string; subTitle?: string }[];
  activeIndex: number;
  customClasses?: string;
  onClick?: (selectedIndex: number) => void;
}

export const DetailedTile: React.FC<Props> = ({
  options,
  activeIndex,
  customClasses,
  onClick
}) => {
  // Manually calculated responsive styles:
  // Ideally we should use Tailwind screen presets, but this case
  // needed a more finely calculated width which couldn't be done with
  // presets (i.e responsivelyCalculatedWidth)
  const { width } = useWindowSize();
  const responsivelyCalculatedWidth = `${
    width > 320 ? 100 / options.length : 100
  }%`;
  const responsivelyCalculatedDividers = `${
    width > 320 ? 'divide-x' : 'divide-y'
  }`;
  const responsivelyCalculatedContainerPadding = `${
    width > 320 ? 'py-4' : 'pb-4 px-4'
  }`;
  const responsivelyCalculatedButtonPadding = `${width <= 320 && 'pt-4'}`;
  const responsivelyCalculatedSpaceBetween = `${width <= 320 && 'space-y-4'}`;
  const responsivelyCalculatedFlex = `${width <= 320 && 'flex-col'}`;

  const renderedButtons = options.map((option) => (
    <>
      <button
        className={`h-full transition-opacity border-gray-syn6 inline-block text-center ${responsivelyCalculatedButtonPadding}`}
        style={{ width: responsivelyCalculatedWidth }}
      >
        <img src={option.icon} alt="Icon" className="w-8 h-8 mx-auto mb-3" />
        <div className="text-sm mb-0.5">{option.title}</div>
        <div className="text-xs text-gray-syn4">{option.subTitle}</div>
      </button>
    </>
  ));

  const renderedHighlightRings = options.map((option, index) => (
    <>
      <button
        className={`${
          activeIndex === index && 'border-blue shadow-lg shadow-blue'
        } border border-transparent transition-opacity h-full block`}
        style={{
          width: responsivelyCalculatedWidth,
          borderRadius: '0.3125rem'
        }}
        onClick={() => {
          onClick(index);
        }}
      />
    </>
  ));

  return (
    <div
      className={`${customClasses} relative w-full min-h-32 border border-gray-syn6`}
      style={{ borderRadius: '0.3125rem' }}
    >
      {/* Options */}
      <div
        className={`h-full ${responsivelyCalculatedDividers} border-gray-syn6 ${responsivelyCalculatedContainerPadding} ${responsivelyCalculatedSpaceBetween} relative transform relative`}
      >
        {renderedButtons}
      </div>

      {/* Blue highlight rings */}
      <div
        className={`absolute w-full h-full left-0 top-0 flex ${responsivelyCalculatedFlex}`}
      >
        {renderedHighlightRings}
      </div>
    </div>
  );
};
