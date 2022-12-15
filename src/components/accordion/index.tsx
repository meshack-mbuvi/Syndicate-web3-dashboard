import { ChevronDownIcon } from '@heroicons/react/outline';
import React from 'react';
import TransitionInChildren from '../transition/transitionInChildren';

interface Props {
  items: { title: string; content: any }[];
  visibleItemIndex?: number | null;
  handleVisibleItemChange: (newIndex: number | null) => void;
  titleClassName?: string;
  contentClassName?: string;
  extraClasses?: string;
}

export const Accordion: React.FC<Props> = ({
  items,
  visibleItemIndex,
  handleVisibleItemChange,
  titleClassName = 'font-mono uppercase tracking-e2',
  contentClassName = 'text-base',
  extraClasses
}) => {
  const renderedAccordion = items.map(
    (item: { title: string; content: any }, index: number) => {
      return (
        <button
          key={index}
          className={`border-gray-syn6 items-center overflow-hidden w-full ${
            index === visibleItemIndex ? 'p-5 h-auto' : 'px-5 py-4 h-14'
          }`}
          onClick={(): void => {
            if (index === visibleItemIndex) {
              handleVisibleItemChange(null);
            } else {
              handleVisibleItemChange(index);
            }
          }}
        >
          {/* Title */}
          <div
            className={`flex justify-between items-center ${titleClassName}`}
          >
            <div className="text-left">{item.title}</div>
            <div
              className={`transform transition-all duration-500`}
              style={{
                transform: `scaleY(${index === visibleItemIndex ? '-1' : '1'})`
              }}
            >
              <ChevronDownIcon width={16} height={16} color="#90949E" />
            </div>
          </div>

          {/* Content */}
          <div>
            <div
              className={`pt-4 text-gray-syn3 text-left ${
                contentClassName ? contentClassName : ''
              }`}
            >
              <TransitionInChildren
                transitionDurationClassOverride="duration-500"
                isChildVisible={visibleItemIndex === index}
              >
                {item.content}
              </TransitionInChildren>
            </div>
          </div>
        </button>
      );
    }
  );
  return (
    <div
      className={`border border-gray-syn6 rounded-custom divide-y overflow-hidden ${extraClasses}}`}
    >
      {renderedAccordion}
    </div>
  );
};
