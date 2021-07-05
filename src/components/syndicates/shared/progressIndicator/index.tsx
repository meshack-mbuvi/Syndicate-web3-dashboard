// component to show syndicate deposits progress

interface IProgressIndicator {
  currentProgress?: number;
}
export const ProgressIndicator = (props: IProgressIndicator) => {
  const { currentProgress } = props;

  return (
    <div className="relative pt-1">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-md bg-yellow">
        <div
          style={{ width: `${currentProgress}%` }}
          className="shadow-none flex flex-col transition-all text-center whitespace-nowrap text-white justify-center bg-blue"
        ></div>
      </div>
    </div>
  );
};
