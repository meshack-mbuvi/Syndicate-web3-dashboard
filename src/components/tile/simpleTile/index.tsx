export enum TileElevation {
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY'
}

interface Props {
  elevation?: TileElevation;
  addOn?: any;
  onClick?: () => void;
}

export const SimpleTile: React.FC<Props> = ({
  elevation = TileElevation.SECONDARY,
  addOn,
  onClick,
  children
}) => {
  return (
    <button
      className={`w-full px-5 py-4 ${
        elevation === TileElevation.SECONDARY
          ? 'bg-gray-syn8 hover:bg-gray-syn7'
          : ''
      } ${
        elevation === TileElevation.TERTIARY
          ? 'bg-gray-syn7 hover:bg-gray-syn6'
          : ''
      } transition-all ease-out rounded-custom flex items-center justify-between`}
      onClick={onClick}
    >
      <div>{children}</div>
      {addOn && <div>{addOn}</div>}
    </button>
  );
};
