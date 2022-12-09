import React from 'react';

export enum CTAStyle {
  REGULAR = 'base-CTA regular',
  DARK = 'base-CTA dark',
  DARK_OUTLINED = 'base-CTA dark-outlined',
  BLANK = 'base-CTA blank'
}

export enum CTAType {
  PRIMARY = 'primary',
  TRANSACTIONAL = 'green',
  INVESTMENT_CLUB = 'volt',
  COLLECTIVE = 'cherenkov',
  WARNING = 'orange',
  DISABLED = 'disabled',
  ERROR = 'red'
}

interface Props {
  disabled?: boolean;
  buttonType?: 'submit' | 'reset' | 'button' | undefined;
  fullWidth?: boolean;
  rounded?: boolean;
  style?: CTAStyle;
  type?: CTAType;
  id?: string;
  extraClasses?: string;
  onClick?: any;
  onMouseOver?: any;
  onMouseOut?: any;
  onBlur?: any;
  onFocus?: any;
  href?: string;
  target?: string;
  rel?: string;
}

export const CTAButton: React.FC<Props> = ({
  children,
  disabled = false,
  buttonType = 'button',
  fullWidth = false,
  rounded = false,
  type = CTAType.PRIMARY,
  style = CTAStyle.REGULAR,
  id,
  extraClasses,
  onClick,
  onMouseOver,
  onMouseOut,
  onBlur,
  onFocus,
  href,
  target,
  rel,
  ...rest
}) => {
  return (
    <>
      {href ? (
        <a
          href={href}
          target={target}
          className={`${type} ${style} ${fullWidth ? 'w-full' : ''} ${
            rounded ? 'rounded-full' : ''
          } ${extraClasses ?? ''}`}
          type={buttonType}
          id={id}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onFocus={onFocus}
          onMouseOut={onMouseOut}
          onBlur={onBlur}
          rel={rel}
          {...rest}
        >
          {children}
        </a>
      ) : (
        <button
          className={`${style} ${fullWidth ? 'w-full' : ''} ${
            rounded ? 'rounded-full' : ''
          } ${extraClasses ?? ''} ${disabled ? CTAType.DISABLED : type}`}
          disabled={disabled ? true : type === CTAType.DISABLED ? true : false}
          type={buttonType}
          id={id}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onFocus={onFocus}
          onMouseOut={onMouseOut}
          onBlur={onBlur}
          {...rest}
        >
          {children}
        </button>
      )}
    </>
  );
};
