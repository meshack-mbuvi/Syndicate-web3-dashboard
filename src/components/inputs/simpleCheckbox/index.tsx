import { FC } from 'react';

interface Props {
  isActive: boolean;
  usePartialCheck?: boolean;
  extraClasses?: string;
  onChange?: (isActive: boolean) => void;
}

export const Checkbox: FC<Props> = ({
  isActive,
  usePartialCheck = false,
  extraClasses,
  onChange
}) => {
  return (
    <input
      className={`appearance-none bg-transparent rounded focus:ring-offset-0 cursor-pointer ${
        usePartialCheck ? 'partial' : ''
      } ${extraClasses || ''}`}
      type="checkbox"
      checked={isActive}
      onChange={(): void => {
        if (onChange) {
          onChange(!isActive);
        }
      }}
    />
  );
};
