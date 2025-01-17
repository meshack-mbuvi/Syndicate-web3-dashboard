interface IProps {
  height?: number;
  width?: number;
  textColorClass?: string;
  extraClasses?: string;
}

export const SyndicateTokenLogo: React.FC<IProps> = ({
  height = 12,
  width = 12,
  textColorClass = 'text-gray-syn4',
  extraClasses
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      className={`fill-current ${textColorClass} ${extraClasses}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2495 13.8281L27.8523 5.22534L26.7748 4.14784L18.1672 12.7554L22.8255 1.50849L21.4177 0.925391L16.7608 12.1689V0H15.237V12.1699L10.5797 0.925391L9.17183 1.50849L13.8281 12.7504L5.2255 4.14784L4.14801 5.22534L12.7511 13.8284L1.50844 9.17187L0.925338 10.5797L12.1694 15.2368H0V16.7606H12.1694L0.925338 21.4177L1.50844 22.8256L12.7554 18.1672L4.14801 26.7746L5.2255 27.8521L13.8281 19.2495L9.17183 30.4915L10.5797 31.0746L15.237 19.8301V32H16.7608V19.8311L21.4177 31.0746L22.8255 30.4915L18.1672 19.2445L26.7748 27.8521L27.8523 26.7746L19.2452 18.1675L30.4915 22.8256L31.0746 21.4177L19.8305 16.7606H32V15.2368H19.8305L31.0746 10.5797L30.4915 9.17187L19.2495 13.8281Z"
      />
    </svg>
  );
};
