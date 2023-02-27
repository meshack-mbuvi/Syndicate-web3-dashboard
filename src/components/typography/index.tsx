import clsx from 'clsx';
import { ReactNode, RefObject } from 'react';
// Title

export const T1 = ({
  children,
  medium,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: string | JSX.Element;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: React.ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-T1 transform transition-font-size',
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const T2 = ({
  children,
  medium,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-T2 transform transition-font-size',
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const T3 = ({
  children,
  medium,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-T3 transform transition-font-size',
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const T4 = ({
  children,
  medium,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-T4 transform transition-font-size',
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const T5 = ({
  children,
  medium,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-T5 transform transition-font-size',
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

// Heading

export const H1 = ({
  forwardRef,
  children,
  regular,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  forwardRef?: RefObject<HTMLDivElement> | null;
  children?: ReactNode;
  regular?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      ref={forwardRef}
      className={clsx(
        'text-H1-mobile sm:text-H1 transform transition-font-size',
        weightClassOverride
          ? weightClassOverride
          : regular
          ? 'font-regular'
          : 'font-medium',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const H2 = ({
  children,
  regular,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  regular?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-H2-mobile sm:text-H2 transform transition-font-size',
        weightClassOverride
          ? weightClassOverride
          : regular
          ? 'font-regular'
          : 'font-medium',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const H3 = ({
  children,
  regular,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  regular?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-H3-mobile sm:text-H3 transform transition-font-size',
        weightClassOverride
          ? weightClassOverride
          : regular
          ? 'font-regular'
          : 'font-medium',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const H4 = ({
  children,
  regular,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  regular?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-H4-mobile sm:text-H4 transform transition-font-size',
        weightClassOverride
          ? weightClassOverride
          : regular
          ? 'font-regular'
          : 'font-medium',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

// Labels

export const L1 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-base uppercase tracking-px transform transition-font-size',
        weightClassOverride ? weightClassOverride : 'font-bold',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const L2 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-sm uppercase tracking-px transform transition-font-size',
        weightClassOverride ? weightClassOverride : 'font-bold',
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

// Eyebrow

export const E1 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'font-mono uppercase tracking-e1 transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const E2 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'font-mono text-sm uppercase tracking-e2 transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

// Body

export const B1 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-lg transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const B2 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-base transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const B3 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-sm transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const B4 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-xs transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

// Monospace

export const M1 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-base font-mono transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const M2 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-sm font-mono transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

// Data

export const D1 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-base font-mono transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const D2 = ({
  children,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'text-sm font-mono transform transition-font-size',
        weightClassOverride,
        extraClasses
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const FL = ({
  children,
  extraClasses,
  ...rest
}: {
  children?: ReactNode;
  extraClasses?: string;
  [rest: string]: ReactNode;
}): JSX.Element => {
  return (
    <div
      className={clsx(
        'font-medium transform transition-font-size',
        extraClasses
      )}
      style={{
        fontSize: '0.9375rem'
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
