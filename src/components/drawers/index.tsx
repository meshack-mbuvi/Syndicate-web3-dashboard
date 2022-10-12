/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ChevronDownIcon } from '@heroicons/react/outline';
import { useRef } from 'react';

interface Props {
  items: { title: string; content: any }[];
  visibleItemIndex?: number | null;
  handleVisibleItemChange: (newIndex: number | null) => void;
}

export const Drawers: React.FC<Props> = ({
  items,
  visibleItemIndex,
  handleVisibleItemChange
}) => {
  const drawerRefs = useRef<HTMLInputElement[]>([]);
  const renderedDrawers = items.map(
    (item: { title: string; content: any }, index: number) => {
      return (
        <button
          key={index}
          className="border-gray-syn6 items-center p-5 overflow-hidden w-full"
          onClick={() => {
            if (index === visibleItemIndex) {
              handleVisibleItemChange(null);
            } else {
              handleVisibleItemChange(index);
            }
          }}
        >
          {/* Title */}
          <div
            className="flex justify-between items-center font-mono uppercase"
            style={{
              letterSpacing: '2px'
            }}
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
            className="transition-all duration-500"
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
              ref={(ref) => {
                // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
                if (ref && !drawerRefs.current.includes(ref)) {
                  // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
                  drawerRefs.current.push(ref);
                }
              }}
              className={`${
                visibleItemIndex === index ? `opacity-100` : 'opacity-0'
              } pt-4 text-gray-syn3 00 transition-all duration-500 text-left`}
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
