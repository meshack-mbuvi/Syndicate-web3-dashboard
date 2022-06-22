interface ProgressBarProps {
  percentageWidth: number;
  tailwindColor: string;
  extraClasses?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentageWidth,
  tailwindColor,
  extraClasses
}) => (
  <div className={`${extraClasses}`}>
    <div className={`relative h-1`}>
      <div className={`absolute ${tailwindColor} opacity-20 w-full h-full`} />
      <div
        className={`absolute ${tailwindColor} h-full transition-all duration-500`}
        style={{ width: `${percentageWidth}%` }}
      />
    </div>
  </div>
);

export default ProgressBar;
