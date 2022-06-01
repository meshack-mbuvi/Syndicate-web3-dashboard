import React from 'react';

interface Props {
  disabled?: boolean;
  onClick?;
  greenCta?: boolean;
  type?;
  fullWidth?: boolean;
}

export const CtaButton: React.FC<Props> = ({
  onClick,
  children,
  greenCta,
  disabled = false,
  type = 'button',
  fullWidth = true
}) => {
  return (
    <button
      className={`${fullWidth ? 'w-full' : ''} py-4 ${
        disabled
          ? 'primary-CTA-disabled text-gray-syn4'
          : greenCta
          ? 'green-CTA'
          : 'primary-CTA'
      }`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
