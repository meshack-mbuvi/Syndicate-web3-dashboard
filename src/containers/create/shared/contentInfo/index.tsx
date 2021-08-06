export const ContentInfo: React.FC = (props) => {
  return (
    <div
      id="right-columns"
      className="flex-1 pl-4 h-1/2 overflow-y-scroll no-scroll-bar"
    >
      {props.children}
    </div>
  );
};