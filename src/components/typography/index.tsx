// Title

export const T1 = ({
  children,
  medium,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: any;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-T1 transform transition-font-size ${
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold'
      } ${weightClassOverride} ${extraClasses}`}
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
  children?: any;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-T2 transform transition-font-size ${
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold'
      } ${weightClassOverride} ${extraClasses}`}
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
  children?: any;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-T3 transform transition-font-size ${
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold'
      } ${weightClassOverride} ${extraClasses}`}
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
  children?: any;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-T4 transform transition-font-size ${
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold'
      } ${weightClassOverride} ${extraClasses}`}
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
  children?: any;
  medium?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-T5 transform transition-font-size ${
        weightClassOverride
          ? weightClassOverride
          : medium
          ? 'font-medium'
          : 'font-semibold'
      } ${weightClassOverride} ${extraClasses}`}
      {...rest}
    >
      {children}
    </div>
  );
};

// Heading

export const H1 = ({
  children,
  regular,
  weightClassOverride,
  extraClasses,
  ...rest
}: {
  children?: any;
  regular?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-H1-mobile sm:text-H1 transform transition-font-size ${
        weightClassOverride
          ? weightClassOverride
          : regular
          ? 'font-regular'
          : 'font-medium'
      } ${weightClassOverride} ${extraClasses}`}
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
  children?: any;
  regular?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-H2-mobile sm:text-H2 transform transition-font-size ${
        weightClassOverride
          ? weightClassOverride
          : regular
          ? 'font-regular'
          : 'font-medium'
      } ${weightClassOverride} ${extraClasses}`}
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
  children?: any;
  regular?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-H3-mobile sm:text-H3 transform transition-font-size ${
        weightClassOverride
          ? weightClassOverride
          : regular
          ? 'font-regular'
          : 'font-medium'
      } ${weightClassOverride} ${extraClasses}`}
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
  children?: any;
  regular?: boolean;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-H4-mobile sm:text-H4 transform transition-font-size ${
        weightClassOverride
          ? weightClassOverride
          : regular
          ? 'font-regular'
          : 'font-medium'
      } ${weightClassOverride ?? ''} ${extraClasses ?? ''}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-base uppercase tracking-px transform transition-font-size ${
        weightClassOverride ? weightClassOverride : 'font-bold'
      } ${weightClassOverride ?? ''} ${extraClasses ?? ''}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-sm uppercase tracking-px transform transition-font-size ${
        weightClassOverride ? weightClassOverride : 'font-bold'
      } ${weightClassOverride} ${extraClasses}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`font-mono uppercase transform transition-font-size ${
        weightClassOverride && weightClassOverride
      } ${extraClasses}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`font-mono text-sm uppercase transform transition-font-size ${
        weightClassOverride && weightClassOverride
      } ${extraClasses}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-lg transform transition-font-size ${
        weightClassOverride && weightClassOverride
      } ${extraClasses}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-base transform transition-font-size ${
        weightClassOverride ?? ''
      } ${extraClasses}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-sm transform transition-font-size ${
        weightClassOverride ?? ''
      } ${extraClasses ?? ''}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-xs transform transition-font-size ${
        weightClassOverride ?? ''
      } ${extraClasses ?? ''}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-base font-mono transform transition-font-size ${
        weightClassOverride && weightClassOverride
      } ${extraClasses}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-sm font-mono transform transition-font-size ${
        weightClassOverride && weightClassOverride
      } ${extraClasses}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-base font-mono transform transition-font-size ${
        weightClassOverride && weightClassOverride
      } ${extraClasses}`}
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
  children?: any;
  weightClassOverride?: string;
  extraClasses?: string;
  [rest: string]: any;
}): JSX.Element => {
  return (
    <div
      className={`text-sm font-mono transform transition-font-size ${
        weightClassOverride && weightClassOverride
      } ${extraClasses}`}
      {...rest}
    >
      {children}
    </div>
  );
};
