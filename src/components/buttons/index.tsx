/**
 * Primary button has a green background and white text
 * @param {*} props
 */
const PrimaryButton: React.FC<{
  disabled?: boolean;
  customClasses: string;
  onClick?: () => void;
  type?;
  approved?: boolean;
  createSyndicate?: boolean;
  textColor?: string;
  icon?: string;
}> = (props) => {
  const {
    children,
    customClasses = "bg-light-green",
    approved = false,
    createSyndicate = false,
    textColor = "text-white",
    icon,
    ...rest
  } = props;

  return (
    <button
      className={`flex items-center justify-center border text-base font-light rounded-lg focus:outline-none focus:ring ${textColor} ${customClasses}`}
      {...rest}
    >
      {approved ? (
        <img
          className="inline w-4 mr-2"
          src="/images/checkmark-approved.svg"
          alt="Approved"
        />
      ) : null}
      {createSyndicate ? (
        <img
          className="inline w-4 mr-4"
          src={`/images/${
            textColor === "text-white" ? "plus-circle-white" : "plus-circle"
          }.svg`}
          alt=""
        />
      ) : null}
      {icon ? <img className="inline w-4 mr-4" src={icon} alt="" /> : null}
      {children}
    </button>
  );
};

export default PrimaryButton;
