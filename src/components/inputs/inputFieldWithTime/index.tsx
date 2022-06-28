import { InputField } from '../inputField';

export const InputFieldWithTime = (props: {
  value?: string;
  placeholderLabel?: string;
  infoLabel?: string | React.ReactElement;
  isInErrorState?: boolean;
  extraClasses?: string;
  onChange: (e) => void;
}): React.ReactElement => {
  const {
    value,
    placeholderLabel = 'Unlimited',
    infoLabel,
    isInErrorState = false,
    extraClasses = '',
    onChange,
    ...rest
  } = props;

  return (
    <>
      <div className="relative w-full">
        {console.log(`value: ${value}`)}
        <InputField
          value={value}
          placeholderLabel={placeholderLabel}
          isInErrorState={isInErrorState}
          extraClasses={extraClasses}
          onChange={onChange}
          type="time"
          {...rest}
        />
      </div>
      {infoLabel && (
        <div
          className={`text-sm mt-2 ${
            isInErrorState ? 'text-red-error' : 'text-gray-syn4'
          }`}
        >
          {infoLabel}
        </div>
      )}
    </>
  );
};