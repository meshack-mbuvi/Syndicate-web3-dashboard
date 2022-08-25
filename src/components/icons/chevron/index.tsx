export enum ChevronIconDirection {
  UP = 'transform rotate-0',
  DOWN = 'transform rotate-180'
}

interface IProps {
  height?: number;
  width?: number;
  textColorClass?: string;
  direction?: ChevronIconDirection;
  extraClasses?: string;
}

export const ChevronIcon: React.FC<IProps> = ({
  height = 20,
  width = 20,
  textColorClass = 'text-white',
  direction = ChevronIconDirection.UP,
  extraClasses
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${textColorClass} ${direction} ${
        extraClasses && extraClasses
      }`}
    >
      <path d="M9.99568 6.25C9.77979 6.25 9.5639 6.32669 9.4171 6.47239L2.73316 12.5537C2.58636 12.684 2.5 12.8528 2.5 13.0445C2.5 13.4433 2.83679 13.75 3.28584 13.75C3.50173 13.75 3.70035 13.6733 3.84715 13.5506L9.99568 7.96779L16.1528 13.5506C16.291 13.6733 16.4896 13.75 16.7142 13.75C17.1632 13.75 17.5 13.4433 17.5 13.0445C17.5 12.8528 17.4136 12.684 17.2668 12.546L10.5829 6.47239C10.4188 6.32669 10.2202 6.25 9.99568 6.25Z" />
    </svg>
  );
};
