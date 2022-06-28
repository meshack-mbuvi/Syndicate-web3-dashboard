import useWindowSize from '@/hooks/useWindowSize';
import { useEffect, useRef, useState } from 'react';
import { Switch, SwitchType } from '../switch';
import { B2, H3 } from '../typography';

interface Props {
  title: string;
  rows: {
    title: string;
    value: string | any;
  }[];
  extraClasses: string;
}

export const CollapsibleTable: React.FC<Props> = ({
  title,
  rows,
  extraClasses
}) => {
  const rowsRef = useRef<HTMLInputElement>();
  const [maxHeight, setMaxHeight] = useState('100vh');
  const [isExpanded, setIsExpanded] = useState(true);

  const windowWidth = useWindowSize().width;

  const updateMaxHeight = () => {
    if (isExpanded && rowsRef) {
      const rowsHeight = rowsRef.current
        ? rowsRef.current.getBoundingClientRect().height
        : 0;
      if (rowsHeight) {
        setMaxHeight(`${rowsHeight}px`);
      }
    }
  };

  useEffect(() => {
    updateMaxHeight();
  }, [windowWidth]);

  return (
    <div className="space-y-8">
      {/* Top row */}
      <div className="flex justify-between items-center">
        <H3>{title}</H3>
        <Switch
          isOn={isExpanded}
          type={SwitchType.EXPLICIT}
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        />
      </div>

      {/* Divider */}
      <hr className="border-gray-syn7" />

      {/* Rows */}
      <div
        ref={rowsRef}
        className={`space-y-10 transition-all duration-500 overflow-hidden ${extraClasses}`}
        style={{
          maxHeight: `${isExpanded ? maxHeight : '0px'}`,
          opacity: `${isExpanded ? '100' : '0'}`
        }}
      >
        {rows.map((row, index) => {
          return (
            <div key={index} className={`flex justify-between`}>
              <B2 className="text-gray-syn4 flex-shrink-0">{row.title}</B2>
              <B2 className="flex space-x-3 items-center max-w-7/12">
                <div>{row.value}</div>
              </B2>
            </div>
          );
        })}
      </div>
    </div>
  );
};
