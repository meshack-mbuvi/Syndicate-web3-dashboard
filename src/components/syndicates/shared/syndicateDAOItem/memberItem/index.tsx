interface MemberProps {
  avatar: string;
  name: string;
}

export const MemberItem = (props: MemberProps) => {
  const { avatar, name } = props;
  return (
    <div className="flex justify-start mr-2 items-center">
      <div
        style={{
          background: `url(${avatar}) no-repeat center center`,
          backgroundSize: "cover",
        }}
        className="mr-2 rounded-full w-3.5 h-3.5 bg-gray-90"
      ></div>
      <p className="text-xs text-gray-3 font-whyte-light">{name}</p>
    </div>
  );
};
