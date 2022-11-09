import { ChevronDownIcon } from '@heroicons/react/outline';
import React, { useRef } from 'react';

interface Props {
  items: { title: string; content: any }[];
  visibleItemIndex?: number | null;
  handleVisibleItemChange: (newIndex: number | null) => void;
  titleClassName?: string;
  contentClassName?: string;
}

export const Drawers: React.FC<Props> = ({
  items,
  visibleItemIndex,
  handleVisibleItemChange,
  titleClassName = 'font-mono uppercase tracking-e2',
  contentClassName = 'text-base'
}) => {
  const drawerRefs = useRef<HTMLInputElement[]>([]);
  const renderedDrawers = items.map(
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
          <div
            className="transition-all duration-500 overflow-hidden"
            style={{
              height: `${
                visibleItemIndex === index
                  ? `${
                      drawerRefs.current[index].getBoundingClientRect().height
                    }px`
                  : '0px'
              }`
            }}
          >
            <div
              ref={(ref): void => {
                // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
                if (ref && !drawerRefs.current.includes(ref)) {
                  // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
                  drawerRefs.current.push(ref);
                }
              }}
              className={`${
                visibleItemIndex === index ? `opacity-100` : 'opacity-0'
              } pt-4 text-gray-syn3 00 transition-all duration-500 text-left ${contentClassName}`}
            >
              {item.content}
            </div>
          </div>
        </button>
      );
    }
  );
  return (
    <div className="border border-gray-syn6 rounded-custom divide-y overflow-hidden">
      {renderedDrawers}
    </div>
  );
};
