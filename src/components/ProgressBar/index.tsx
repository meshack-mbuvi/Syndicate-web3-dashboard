interface ProgressBarProps {
  percentageWidth: number;
  tailwindColor: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentageWidth,
  tailwindColor
}) => (
  <div className="relative h-1">
    <div className={`absolute ${tailwindColor} opacity-20 w-full h-full`} />
    <div
      className={`absolute ${tailwindColor} h-full`}
      style={{ width: `${percentageWidth}%` }}
    />
  </div>
);

export default ProgressBar;
