import { useEffect, useRef } from 'react';

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
  const jazzicon = require('@metamask/jazzicon');
  const containerRef = useRef<HTMLDivElement>(null);
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  const iconElement: HTMLDivElement = jazzicon(
    (diameterRem ? diameterRem : 1.5) * 16,
    seed
  );

  useEffect(() => {
    if (containerRef.current?.hasChildNodes()) {
      containerRef.current.removeChild(containerRef.current.firstChild as Node);
      containerRef.current!.appendChild(iconElement);
    } else {
      containerRef.current!.appendChild(iconElement);
    }
  }, [address]);

  return (
    <div
      ref={containerRef}
      className={`${extraClasses}`}
      style={{
        height: `${diameterRem ? diameterRem : 1.5}rem`,
        width: `${diameterRem ? diameterRem : 1.5}rem`
      }}
    />
  );
};
