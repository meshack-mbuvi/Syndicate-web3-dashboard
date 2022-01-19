import { FC } from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  options?: Option[];
  value?: string;
  onChange?: (val: string) => void;
  activeAssetTab: string;
}

const TabsButton: FC<Props> = ({
  options = [],
  onChange = () => false,
  activeAssetTab,
}) => {
  const handleChange = (val: string) => {
    onChange(val);
  };

  return (
    <div
      className={`text-sm leading-4 inline-flex border-1 border-gray-syn6 rounded-3xl box-border`}
    >
      {options.map(({ label, value: val }, index) => {
        return (
          <div
            key={index}
            onClick={() => handleChange(val)}
            onKeyPress={() => handleChange(val)}
            role="button"
            tabIndex={0}
            className={`border-1 px-3 py-1.5 rounded-3xl cursor-pointer box-border ${
              val === activeAssetTab
                ? "border-gray-white text-white"
                : "border-transparent text-gray-lightManatee hover:text-white"
            }`}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default TabsButton;
