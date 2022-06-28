import React from 'react';

interface Props {
  disabled?: boolean;
  onClick?;
  greenCta?: boolean;
  type?;
  fullWidth?: boolean;
  extraClasses?: string;
}

export const CtaButton: React.FC<Props> = ({
  onClick,
  children,
  greenCta,
  disabled = false,
  type = 'button',
  fullWidth = true,
  extraClasses
}) => {
  return (
    <button
      className={`${fullWidth ? 'w-full' : ''} py-4 ${
        disabled
          ? 'primary-CTA-disabled text-gray-syn4'
          : greenCta
          ? 'green-CTA'
          : 'primary-CTA'
      } ${extraClasses}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
