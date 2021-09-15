export const ContentInfo: React.FC = (props) => {
  return (
    <div
      id="right-columns"
      className="flex-1 w-1/6m px-1 h-3/4 overflow-y-scroll no-scroll-bar"
    >
      {props.children}
    </div>
  );
};
