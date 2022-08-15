interface IProps {
  title?: string;
  classoverride?: string;
}

const HeaderSection: React.FC<IProps> = ({ title, classoverride }) => {
  if (!title) return null;

  return (
    <h4
      className={`text-xs sm:text-sm sm:leading-4 text-white opacity-50 uppercase tracking-wider font-bold px-8 ${classoverride}`}
    >
      {title}
    </h4>
  );
};

export default HeaderSection;
