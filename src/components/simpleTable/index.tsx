interface Props {
  rows: {
    title: string;
    value: string;
    externalLink?: string;
  }[];
  extraClasses: string;
}

export const SimpleTable: React.FC<Props> = ({ rows, extraClasses }) => {
  return (
    <div className="divide-y pb-5">
      {rows.map((row, index) => {
        return (
          <div
            key={index}
            className={`flex justify-between py-4 border-gray-4 ${extraClasses}`}
          >
            <div className="text-gray-syn4">{row.title}</div>
            <div className="font-mono flex space-x-3 items-center">
              <div>{row.value}</div>
              <a href={row.externalLink} target="_blank" rel="noreferrer">
                <img
                  src="/images/externalLinkGray4.svg"
                  alt="External link icon"
                  width="75%"
                />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};
