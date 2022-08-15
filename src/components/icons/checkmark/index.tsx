interface IProps {
  height?: number;
  width?: number;
  fill?: string;
}

const CheckmarkIcon: React.FC<IProps> = ({
  height = 14,
  width = 14,
  fill = '#30E696'
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.3125 13.8125C5.72656 13.8125 6.04688 13.6406 6.27344 13.3047L13.6172 1.86719C13.7812 1.60938 13.8516 1.39062 13.8516 1.17969C13.8516 0.625 13.4609 0.242188 12.8984 0.242188C12.5156 0.242188 12.2812 0.382812 12.0469 0.75L5.27344 11.4922L1.79688 7.03125C1.5625 6.72656 1.32031 6.60156 0.976562 6.60156C0.414062 6.60156 0.0078125 7 0.0078125 7.54688C0.0078125 7.78906 0.09375 8.02344 0.296875 8.26562L4.34375 13.3125C4.61719 13.6562 4.90625 13.8125 5.3125 13.8125Z"
        fill={fill}
      />
    </svg>
  );
};

export default CheckmarkIcon;
