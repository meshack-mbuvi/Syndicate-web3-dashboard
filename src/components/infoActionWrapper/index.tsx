import React from 'react';
import CheckmarkIcon from '../icons/checkmark';

interface Props {
  title?: string;
  actionButtonLabel?: string;
  helperText?: string;
  handleAction?: () => void;
  customClasses?: string;
  errors?: string;
  validAddressCount?: number;
}

export const InfoActionWrapper: React.FC<Props> = ({
  title,
  actionButtonLabel,
  helperText,
  handleAction,
  customClasses,
  children,
  errors,
  validAddressCount
}) => {
  const handleClick = () => {
    if (!validAddressCount && errors) return null;
    handleAction();
  };

  return (
    <div className={`${customClasses} space-y-2`}>
      <div className="flex justify-between">
        <div>{title}</div>
        <button onClick={handleClick} disabled={validAddressCount && !errors}>
          {validAddressCount && !errors ? (
            <span className="flex items-center space-x-2 text-green cursor-default">
              <CheckmarkIcon />
              <span>
                {validAddressCount}{' '}
                {validAddressCount === 1 ? 'address' : 'addresses'}
              </span>
            </span>
          ) : (
            <span className="text-blue">{actionButtonLabel}</span>
          )}
        </button>
      </div>
      <div>{children}</div>

      {errors ? (
        <p className="text-red-500 text-xs break-all -mt-1 pb-11">{errors}</p>
      ) : (
        <div className="text-gray-syn4 text-sm">{helperText}</div>
      )}
    </div>
  );
};
