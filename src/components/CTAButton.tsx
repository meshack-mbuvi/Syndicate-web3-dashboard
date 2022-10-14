import React from 'react';

interface Props {
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  greenCta?: boolean;
  voltCta?: boolean;
  cherenkovCta?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  fullWidth?: boolean;
  extraClasses?: string;
}

export const CtaButton: React.FC<Props> = ({
  onClick,
  children,
  greenCta,
  voltCta,
  cherenkovCta,
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
          : voltCta
          ? 'volt-CTA'
          : cherenkovCta
          ? 'cherenkov-CTA'
          : 'primary-CTA'
      } ${extraClasses ?? ''}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
