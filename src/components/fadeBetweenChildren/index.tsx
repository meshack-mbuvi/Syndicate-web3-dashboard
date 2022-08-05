import { FC } from 'react';

interface Props {
  visibleChildIndex: number;
  children: React.ReactNode[];
  transitionClassesOverride?: string;
  extraClasses?: string;
}

const FadeBetweenChildren: FC<Props> = ({
  visibleChildIndex,
  children,
  transitionClassesOverride = 'duration-800',
  extraClasses
}) => {
  const renderedTabContent = children.map((child, index) => {
    return [
      <div
        key={index}
        className={`absolute top-0 left-0 w-full h-full ${
          index === visibleChildIndex ? 'opacity-100' : 'opacity-0'
        } transition-all ${transitionClassesOverride} w-fit-content`}
      >
        {child}
      </div>
    ];
  });

  return (
    <div className={`relative ${extraClasses}`}>
      {/* This is for taking up space in the flow */}
      <div className="opacity-0 transition-all w-fit-content">
        {children[visibleChildIndex]}
      </div>

      {/* Children absolutely positioned on top of eachother */}
      {renderedTabContent}
    </div>
  );
};

export default FadeBetweenChildren;
