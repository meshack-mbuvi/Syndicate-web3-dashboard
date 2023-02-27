import clsx from 'clsx';
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

type TileProps = {
  action?: TileAction;
  state?: TileState;
  handleClick: (newState: TileState) => void;
  leftAddon?: JSX.Element;
  title: string;
  subTitle?: string;
  extraClasses?: string;
};

export const Tile = (props: TileProps): JSX.Element => {
  const {
    action = TileAction.SELECT,
    state = TileState.UNSELECTED,
    handleClick,
    leftAddon,
    title,
    subTitle,
    extraClasses
  } = props;

  const borderStyles = `${
    state === TileState.SELECTED
      ? 'border-blue-neptune'
      : 'border-inactive hover:border-white'
  } border focus:outline-none`;

  return (
    <button
      onClick={(): void => {
        if (state === TileState.UNSELECTED) {
          handleClick(TileState.SELECTED);
        } else if (state === TileState.SELECTED) {
          handleClick(TileState.UNSELECTED);
        }
      }}
      className={clsx(
        'w-full text-left cursor-pointer rounded-lg text-base py-5 px-7 transition-all',
        borderStyles,
        extraClasses
      )}
    >
      <div
        className={clsx(
          'flex items-center',
          action !== TileAction.SELECT && 'space-x-4'
        )}
      >
        {/* Icon */}
        <div className={`${action !== TileAction.SELECT ? 'block' : 'hidden'}`}>
          {!leftAddon ? (
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
          ) : (
            leftAddon
          )}
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
            className={`text-sm text-gray-3 ${subTitle ? 'block' : 'hidden'} `}
          >
            {subTitle}
          </div>
        </div>
      </div>
    </button>
  );
};
