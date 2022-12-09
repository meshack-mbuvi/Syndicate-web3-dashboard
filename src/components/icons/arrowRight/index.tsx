interface IProps {
  height?: number;
  width?: number;
  textColorClass?: string;
  extraClasses?: string;
}

export const ArrowRightIcon: React.FC<IProps> = ({
  height = 16,
  width = 16,
  textColorClass = 'text-black',
  extraClasses
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${textColorClass} ${extraClasses}`}
    >
      <path d="M16.5 7C16.5 6.78562 16.4052 6.58839 16.2329 6.42546L10.5118 0.740105C10.3395 0.577176 10.1586 0.499999 9.9518 0.499999C9.52962 0.499999 9.19359 0.808706 9.19359 1.23747C9.19359 1.44327 9.27114 1.64908 9.40899 1.7777L11.339 3.73285L14.2426 6.36544L12.1575 6.23681L1.25821 6.23681C0.810179 6.23681 0.500001 6.55409 0.500001 7C0.500001 7.44591 0.810179 7.76319 1.25821 7.76319L12.1575 7.76319L14.234 7.63456L11.339 10.2672L9.40899 12.2223C9.27114 12.3595 9.19359 12.5567 9.19359 12.7625C9.19359 13.1913 9.52962 13.5 9.9518 13.5C10.1586 13.5 10.3395 13.4314 10.5291 13.2427L16.2329 7.57454C16.4052 7.41161 16.5 7.21438 16.5 7Z" />
    </svg>
  );
};
