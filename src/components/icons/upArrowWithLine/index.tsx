interface IProps {
  height?: number;
  width?: number;
  textColorClass?: string;
  extraClasses?: string;
}

export const UpArrowWithLine: React.FC<IProps> = ({
  height = 16,
  width = 16,
  textColorClass = 'text-black',
  extraClasses
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${textColorClass} ${extraClasses}`}
    >
      <rect
        x="15.4137"
        width="1.37622"
        height="14.8274"
        rx="0.68811"
        transform="rotate(90 15.4137 0)"
      />
      <path d="M8 3.37622C7.78562 3.37622 7.58839 3.471 7.42546 3.64332L2.7401 8.36437C2.57718 8.53669 2.5 8.71763 2.5 8.92442C2.5 9.3466 2.80871 9.68263 3.23747 9.68263C3.44327 9.68263 3.64908 9.60508 3.7777 9.46723L4.73285 8.53723L7.36544 5.63362L7.23681 7.71871L7.23681 15.5553C7.23681 16.0033 7.55409 16.3135 8 16.3135C8.44591 16.3135 8.76319 16.0033 8.76319 15.5553L8.76319 7.71871L8.63456 5.64224L11.2671 8.53723L12.2223 9.46723C12.3595 9.60508 12.5567 9.68263 12.7625 9.68263C13.1913 9.68263 13.5 9.3466 13.5 8.92442C13.5 8.71763 13.4314 8.53669 13.2427 8.34714L8.57454 3.64332C8.41161 3.471 8.21438 3.37622 8 3.37622Z" />
    </svg>
  );
};
