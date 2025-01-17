import { getTextWidth } from '@/utils/getTextWidth';
import { useEffect, useRef, useState } from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

interface AutoGrowInputField extends NumberFormatProps {
  value: string;
  onChangeHandler: (value: string) => void;
  placeholder: string;
  hasError?: boolean;
}
const AutoGrowInputField: React.FC<AutoGrowInputField> = ({
  value,
  onChangeHandler,
  placeholder,
  hasError = false,
  ...rest
}) => {
  const [width, setWidth] = useState(50);
  const [extraWidth, setExtraWidth] = useState(0);
  const [dynamicFontSize, setDynamicFontSize] = useState(48);
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const textWidth = getTextWidth(
      value || placeholder,
      `${dynamicFontSize}px 'Slussen', Helvetica, Arial, sans-serif`
    );

    if (!textWidth) return;

    const diff = dynamicFontSize < 37 ? 5 : 10;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    setExtraWidth(span.current.offsetWidth - (textWidth - diff) - 16); // Only God knows whats happening here
  }, [dynamicFontSize, placeholder, setWidth, value, width]);

  useEffect(() => {
    // add 16 for 1rem spacing
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const size = 48 - span.current.offsetWidth * 0.1;
    const spaceToAdd = size > 12 ? 16 : 12;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    setWidth(span.current.offsetWidth + spaceToAdd);
    // reset font size if no value
    if (!value) {
      setDynamicFontSize(48);
    }
  }, [value]);

  useEffect(() => {
    // Make text grow or shrink based on the current width
    setDynamicFontSize(() => {
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      const tempSize = 48 - span.current.offsetWidth * 0.1;
      // set the minimum font to 16
      return tempSize > 12 ? tempSize : 12;
    });
  }, [dynamicFontSize, width, value]);

  return (
    <div className="h-full text-5xl">
      <span
        className="absolute opacity-0 whitespace-pre"
        style={{ zIndex: -100 }}
        ref={span}
      >
        {value ? value : placeholder}
      </span>
      <NumberFormat
        {...rest}
        value={value}
        thousandSeparator={true}
        className={`bg-transparent border-none outline-none h-full p-0 text-5xl focus:outline-none focus:border-none focus:ring-0 ${
          hasError ? 'text-red-error placeholder-red-error' : ''
        } ${value ? 'text-white' : 'text-gray-syn4'}`}
        style={{
          width: width - extraWidth,
          fontSize: dynamicFontSize
        }}
        placeholder={placeholder}
        onValueChange={(values) => {
          const { value } = values;
          onChangeHandler(value);
        }}
        maxLength={12}
      />
    </div>
  );
};

export default AutoGrowInputField;
