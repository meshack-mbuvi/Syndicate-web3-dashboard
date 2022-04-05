export const Callout = (props: {
  extraClasses?: string;
  children: any;
  backGroundClass?: string;
}) => {
  const {
    extraClasses = 'rounded-xl p-4',
    backGroundClass = 'bg-blue-navy bg-opacity-20',
    children
  } = props;

  return (
    <div
      className={`${backGroundClass} text-blue-navy items-center ${extraClasses}`}
    >
      {children}
    </div>
  );
};
