import { useEffect, useState, FC } from "react";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  options?: Option[];
  value?: string | number;
  onChange?: (val: string | number) => void;
}

const TabsButton: FC<Props> = ({
  options = [],
  value,
  onChange = () => false,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | number>("");

  useEffect(() => setSelectedValue(value), [value]);

  const handleChange = (val: string | number) => {
    setSelectedValue(val);
    onChange(val);
  };

  return (
    <div className="text-sm leading-4 inline-flex border-1 border-gray-steelGrey rounded-3xl box-border">
      {options.map(({ label, value: val }, index) => (
        <div
          key={index}
          onClick={() => handleChange(val)}
          onKeyPress={() => handleChange(val)}
          role="button"
          tabIndex={0}
          className={`border-1 px-3 py-1.5 rounded-3xl cursor-pointer box-border ${
            val === selectedValue
              ? "border-gray-white text-white"
              : "border-transparent text-gray-lightManatee"
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default TabsButton;
