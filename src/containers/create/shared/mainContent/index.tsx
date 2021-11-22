export const MainContent: React.FC = (props) => {
  return (
    <div id="center-column" className={`pt-3 h-full flex flex-col`}>
      <div
        className={`flex flex-col relative px-2 pb-4 no-scroll-bar overflow-y-scroll h-full`}
      >
        {props.children}
      </div>
    </div>
  );
};
