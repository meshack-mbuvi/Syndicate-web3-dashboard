import useWindowSize from "@/hooks/useWindowSize";
import { useState, useRef, useEffect } from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";

interface AutoGrowInputField extends NumberFormatProps {
  value: string;
  onChangeHandler: (value: string) => void;
  placeholder: string;
  errorTextRed?: boolean;
}
const AutoGrowInputField: React.FC<AutoGrowInputField> = ({
  value,
  onChangeHandler,
  placeholder,
  errorTextRed = false,
  ...rest
}) => {
  const [width, setWidth] = useState(50);
  const [dynamicFontSize, setDynamicFontSize] = useState(56);
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // add 16 for 1rem spacing
    setWidth(span.current.offsetWidth + 16);
    // reset font size if no value
    if (!value) {
      setDynamicFontSize(56);
    }
  }, [value]);

  useEffect(() => {
    if (span.current.offsetWidth > width) {
      setDynamicFontSize(() => {
        const tempSize = 56 - span.current.offsetWidth * 0.15;
        // set the minimum font to 16
        return tempSize > 16 ? tempSize : 16;
      });
    }
  }, [dynamicFontSize, width, value]);

  const { width: windowWidth } = useWindowSize();

  return (
    <div className="h-full text-5xl">
      <span
        className="absolute opacity-0 whitespace-pre px-1"
        style={{ zIndex: -100 }}
        ref={span}
      >
        {value ? value : placeholder}
      </span>
      <NumberFormat
        {...rest}
        value={value}
        thousandSeparator={true}
        className={`bg-transparent border-none outline-none h-full p-0 px-1 text-5xl font-whyte focus:outline-none focus:border-none focus:ring-0 ${
          errorTextRed ? "text-red-semantic" : ""
        } ${value ? "text-white" : "text-gray-syn4"}`}
        style={{
          width,
          maxWidth: windowWidth < 1200 && windowWidth < 860 ? 120 : 150,
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
