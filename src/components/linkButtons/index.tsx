import IconPlus from "@/components/icons/plusIcon";
export enum LinkType {
  CALENDAR = "CALENDAR",
  MEMBER = "MEMBER",
}

export const LinkButton = (props: {
  type: LinkType;
  extraClasses?: string;
  onClick: () => void;
}) => {
  const { type, extraClasses = "", onClick, ...rest } = props;

  let icon;
  let label;
  switch (type) {
    case LinkType.CALENDAR:
      icon = "/images/blue-calendar.svg";
      label = "Add to calendar";
      break;
    case LinkType.MEMBER:
      icon = <IconPlus />;
      label = "Add member";
      break;
  }

  return (
    <button
      className={`text-blue flex inline-flex items-center space-x-2 ${extraClasses}`}
      onClick={onClick}
      {...rest}
    >
      {typeof icon === "string" ? (
        <img src={icon} alt="" className="" />
      ) : (
        <IconPlus />
      )}
      <div>{label}</div>
    </button>
  );
};
