// delete icon
interface Idelete {
  color?: string;
  dimensions?: string;
}
export const DeleteIcon = (props: Idelete) => {
  const { color, dimensions } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${dimensions ? dimensions : `h-4 w-4`} ${
        color ? color : `text-red-500 `
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
};

interface IBan {
  color?: string;
}
export const BanIcon = (props: IBan) => {
  const { color } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-10 w-10 ${color ? color : "text-yellow-dark"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  );
};

interface ICancelIcon {
  height?: string;
  width?: string;
  color?: string;
}
export const CancelIcon = (props: ICancelIcon) => {
  const { height = "h-10", width = "w-10", color = "text-red-500" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${height} ${width} ${color}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

interface IChevronDown {
  height?: string;
  width?: string;
}
export const ChevronDown = (props: IChevronDown) => {
  const { height = "h-10", width = "w-10" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${height} ${width} text-gray-3`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

interface ISearchIcon {
  height?: string;
  width?: string;
  color?: string;
}
export const SearchIcon = (props: ISearchIcon) => {
  const { height = "h-10", width = "w-10", color = "text-gray-3" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${height} ${width} ${color}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
};
