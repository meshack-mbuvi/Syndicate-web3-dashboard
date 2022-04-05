export enum TileAction {
  SELECT = 'SELECT',
  CREATE = 'CREATE',
  RADIO = 'CHOOSE'
}

export enum TileState {
  DISABLED = 'DISABLED',
  SELECTED = 'SELECTED',
  UNSELECTED = 'UNSELECTED'
}

export const Tile = (props: {
  action: TileAction;
  state: TileState;
  title: string;
  subTitle?: string;
  extraClasses?: string;
  children: any;
}) => {
  const {
    action = TileAction.SELECT,
    state = TileState.UNSELECTED,
    title,
    subTitle,
    extraClasses
  } = props;

  const borderStyles = `${
    state === TileState.SELECTED
      ? 'border-blue-neptune'
      : 'border-inactive hover:border-white'
  } border`;

  return (
    <div
      className={`cursor-pointer rounded-lg text-base p-7 ${borderStyles} ${extraClasses} transition-all`}
    >
      <div className="flex items-center space-x-4">
        {/* Icon */}
        <div className={`${action !== TileAction.SELECT ? 'block' : 'hidden'}`}>
          <img
            className="inline"
            src={`/images/${
              action === TileAction.CREATE
                ? 'tile/circle-plus'
                : action === TileAction.RADIO && state === TileState.SELECTED
                ? 'tile/circle-check'
                : action === TileAction.RADIO
                ? 'tile/circle'
                : ''
            }.svg`}
            alt="Icon"
          />
        </div>

        {/* Titles */}
        <div className={`space-y-0.5`}>
          <div
            className={`${
              state === TileState.DISABLED ? 'text-gray-3' : 'text-white'
            }`}
          >
            {title}
          </div>
          <div
            className={`text-sm text-gray-3 ${
              action === TileAction.RADIO ? 'block' : 'hidden'
            } `}
          >
            {subTitle}
          </div>
        </div>
      </div>
    </div>
  );
};
