import { FC } from 'react';
import PillTabs from '../tabs';

interface Props {
  tabs: { name: string }[];
  activeIndex: number;
  height: string;
  handleTabChange: (index) => void;
  children: React.ReactNode[];
}

const PillTabsAndContent: FC<Props> = ({
  tabs,
  activeIndex,
  height = '20rem',
  handleTabChange,
  children
}) => {
  const renderedTabContent = children.map((child, index) => {
    return [
      <div
        key={index}
        className={`absolute top-0 left-0 w-full h-full ${
          index === activeIndex ? 'opacity-100' : 'opacity-0'
        } transition-all`}
      >
        {child}
      </div>
    ];
  });

  return (
    <div
      className="pt-4 bg-gray-syn9 flex flex-col"
      style={{ height: `${height}` }}
    >
      {/* Tabs */}
      <PillTabs
        tabs={tabs}
        activeIndex={activeIndex}
        handleTabChange={handleTabChange}
      />

      {/* Content */}
      <div className="relative flex-grow mt-4 bg-opacity-500 w-full">
        {renderedTabContent}
      </div>
    </div>
  );
};

export default PillTabsAndContent;
