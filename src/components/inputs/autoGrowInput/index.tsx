import useWindowSize from "@/hooks/useWindowSize";
import { useEffect, useRef, useState } from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";

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
  const [dynamicFontSize, setDynamicFontSize] = useState(48);
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // add 16 for 1rem spacing
    const size = 48 - span.current.offsetWidth * 0.1;
    const spaceToAdd = size > 12 ? 16 : 12;
    setWidth(span.current.offsetWidth + spaceToAdd);
    // reset font size if no value
    if (!value) {
      setDynamicFontSize(48);
    }
  }, [value]);

  useEffect(() => {
    // Make text grow or shrink based on the current width
    setDynamicFontSize(() => {
      const tempSize = 48 - span.current.offsetWidth * 0.1;
      // set the minimum font to 16
      return tempSize > 12 ? tempSize : 12;
    });
  }, [dynamicFontSize, width, value]);

  const { width: windowWidth } = useWindowSize();
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
        className={`bg-transparent border-none outline-none h-full p-0 text-5xl font-whyte-light focus:outline-none focus:border-none focus:ring-0 ${
          hasError ? "text-red-semantic" : ""
        } ${value ? "text-white" : "text-gray-syn4"}`}
        style={{
          width,
          maxWidth: windowWidth < 1200 && windowWidth < 860 ? 120 : 140,
          fontSize: dynamicFontSize,
        }}
        placeholder={placeholder}
        onValueChange={(values) => {
          const { value } = values;
          onChangeHandler(value);
        }}
      />
    </div>
  );
};

export default AutoGrowInputField;
