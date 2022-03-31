import { FC } from 'react';

interface IDateCardProps {
  mintTime: string;
  isLastItem: boolean;
  index: number;
  activeIndex: number | null;
}
const DateCard: FC<IDateCardProps> = ({
  mintTime,
  isLastItem,
  index,
  activeIndex
}: IDateCardProps) => {
  return (
    <div
      className={`flex items-center w-full h-14 rounded-md ${
        activeIndex === index && `border border-blue-navy`
      }`}
    >
      <div
        className={`text-center w-full h-7 ${
          isLastItem ? 'border-0' : 'border-r border-gray-24'
        }`}
      >
        {mintTime}
      </div>
    </div>
  );
};

export default DateCard;
