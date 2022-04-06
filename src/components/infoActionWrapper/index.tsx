import React from 'react';

interface Props {
  title?: string;
  actionButtonLabel?: string;
  helperText?: string;
  handleAction?: () => void;
  customClasses?: string;
}

export const InfoActionWrapper: React.FC<Props> = ({
  title,
  actionButtonLabel,
  helperText,
  handleAction,
  customClasses,
  children
}) => {
  return (
    <div className={`${customClasses} space-y-2`}>
      <div className="flex justify-between">
        <div>{title}</div>
        <button className="text-blue" onClick={handleAction}>
          {actionButtonLabel}
        </button>
      </div>
      <div>{children}</div>
      <div className="text-gray-syn4 text-sm">{helperText}</div>
    </div>
  );
};
