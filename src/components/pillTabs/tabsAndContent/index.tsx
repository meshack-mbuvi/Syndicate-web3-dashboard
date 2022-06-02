import FadeBetweenChildren from '@/components/fadeBetweenChildren';
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

      <FadeBetweenChildren
        visibleChildIndex={activeIndex}
        extraClasses="mt-4 w-full flex-grow"
      >
        {children}
      </FadeBetweenChildren>
    </div>
  );
};

export default PillTabsAndContent;
