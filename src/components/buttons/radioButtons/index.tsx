import { B2 } from '@/components/typography';
import React from 'react';

interface Props {
  options: string[];
  activeIndex: number;
  handleIndexChange: (newIndex: number) => void;
}

export const RadioButtons: React.FC<Props> = ({
  options,
  activeIndex,
  handleIndexChange
}) => {
  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        return (
          <button
            key={index}
            className="flex space-x-4 items-center"
            onClick={() => {
              handleIndexChange(index);
            }}
          >
            <div
              className={`w-5.5 h-5.5 ${
                activeIndex === index
                  ? 'border-blue border-2'
                  : 'border-gray-syn6 border-1'
              } transition-all rounded-full`}
            >
              <div
                className={`${
                  activeIndex === index ? 'scale-100' : 'scale-0'
                } transition-all mt-1 duration-500 transform w-2.5 h-2.5 bg-blue rounded-full mx-auto`}
              />
            </div>
            <B2>{option}</B2>
          </button>
        );
      })}
    </div>
  );
};
