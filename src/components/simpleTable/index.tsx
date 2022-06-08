interface Props {
  rows: {
    title: string;
    value: string | any;
    externalLink?: string;
  }[];
  extraClasses: string;
}

export const SimpleTable: React.FC<Props> = ({ rows, extraClasses }) => {
  return (
    <div className="divide-y">
      {rows.map((row, index) => {
        return (
          <div
            key={index}
            className={`flex justify-between py-4 border-gray-4 ${extraClasses}`}
          >
            <div className="text-gray-syn4">{row.title}</div>
            <div className="font-mono flex space-x-3 items-center">
              <div>{row.value}</div>
              <a href={row.externalLink}>
                <img
                  src="/images/externalLinkGray4.svg"
                  alt="External link icon"
                />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};
