import TransitionBetweenChildren from '@/components/transitionBetweenChildren';
import { FC } from 'react';
import SegmentedControl from '../tabs';

interface Props {
  tabs: { label: string }[];
  activeIndex: number;
  height?: string;
  handleTabChange: (index: any) => void;
  children: React.ReactNode[];
}

const SegmentedControlAndContent: FC<Props> = ({
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
      <div className="inline-block mx-auto">
        <SegmentedControl
          tabs={tabs}
          activeIndex={activeIndex}
          handleTabChange={handleTabChange}
        />
      </div>

      <TransitionBetweenChildren
        visibleChildIndex={activeIndex}
        extraClasses="mt-4 w-full flex-grow"
      >
        {children}
      </TransitionBetweenChildren>
    </div>
  );
};

export default SegmentedControlAndContent;
