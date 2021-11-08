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
  const [extraWidth, setExtraWidth] = useState(0);
  const [dynamicFontSize, setDynamicFontSize] = useState(48);
  const span = useRef<HTMLSpanElement>(null);

  // Use canvas to determine text width
  const getTextWidth = (text, font) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font || getComputedStyle(document.body).font;
    return context.measureText(text).width;
  };

  useEffect(() => {
    const textWidth = getTextWidth(
      value || placeholder,
      `${dynamicFontSize}px 'ABC Whyte Regular', Helvetica, Arial, sans-serif`,
    );

    const diff = dynamicFontSize < 37 ? 5 : 10;
    setExtraWidth((span.current.offsetWidth - (textWidth - diff)) - 16); // Only God knows whats happening here

  }, [dynamicFontSize, placeholder, setWidth, value, width])

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
          width: width - extraWidth,
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
