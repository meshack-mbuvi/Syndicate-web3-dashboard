import Jazzicon from 'react-jazzicon';

interface Props {
  address: string;
  diameterRem?: number;
  extraClasses?: string;
}

export const JazziconGenerator: React.FC<Props> = ({
  address,
  diameterRem,
  extraClasses
}) => {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return (
    <div className={extraClasses}>
      <Jazzicon diameter={(diameterRem ? diameterRem : 1.5) * 16} seed={seed} />
    </div>
  );
};
