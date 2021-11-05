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
  const { height = "h-4", width = "w-4", color = "text-gray-3" } = props;
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

export const MoreInfoIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 16C12.3765 16 16 12.3686 16 8C16 3.62353 12.3686 0 7.99216 0C3.62353 0 0 3.62353 0 8C0 12.3686 3.63137 16 8 16ZM8 14.6667C4.29804 14.6667 1.34118 11.702 1.34118 8C1.34118 4.29804 4.2902 1.33333 7.99216 1.33333C11.6941 1.33333 14.6588 4.29804 14.6667 8C14.6745 11.702 11.702 14.6667 8 14.6667ZM7.92941 5.20784C8.50196 5.20784 8.94902 4.75294 8.94902 4.18824C8.94902 3.61569 8.50196 3.16078 7.92941 3.16078C7.36471 3.16078 6.9098 3.61569 6.9098 4.18824C6.9098 4.75294 7.36471 5.20784 7.92941 5.20784ZM6.62745 12.3137H9.81961C10.1412 12.3137 10.3922 12.0863 10.3922 11.7647C10.3922 11.4588 10.1412 11.2157 9.81961 11.2157H8.84706V7.22353C8.84706 6.8 8.63529 6.51765 8.23529 6.51765H6.76078C6.43922 6.51765 6.18824 6.76078 6.18824 7.06667C6.18824 7.38824 6.43922 7.61569 6.76078 7.61569H7.6V11.2157H6.62745C6.30588 11.2157 6.0549 11.4588 6.0549 11.7647C6.0549 12.0863 6.30588 12.3137 6.62745 12.3137Z"
        fill="#646871"
      />
    </svg>
  );
};
