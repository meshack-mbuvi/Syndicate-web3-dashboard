import { InputField } from '../inputField';
import { useRouter } from 'next/router';

export const TimeInputField = (props: {
  value?: string;
  placeholderLabel?: string;
  infoLabel?: string | React.ReactElement;
  isInErrorState?: boolean;
  currentTimeZone: string;
  extraClasses?: string;
  onChange: (e) => void;
}): React.ReactElement => {
  const {
    value,
    placeholderLabel = 'Unlimited',
    infoLabel,
    isInErrorState = false,
    currentTimeZone,
    extraClasses = '',
    onChange,
    ...rest
  } = props;
  const router = useRouter();

  // fix to set correct background color on the timezone text
  // to hide icon injected into the time input field in Firefox
  const isClubCreationPage = router.pathname === '/clubs/create';

  return (
    <>
      <div className="relative w-full">
        <InputField
          value={value}
          placeholderLabel={placeholderLabel}
          isInErrorState={isInErrorState}
          extraClasses={extraClasses}
          onChange={onChange}
          type="time"
          {...rest}
        />
        <div
          className="inline absolute top-1/2 right-4"
          style={{ transform: 'translateY(-50%)' }}
        >
          <span
            className={`${
              isClubCreationPage ? 'bg-black' : 'bg-gray-syn8'
            } text-gray-syn4  z-20`}
          >
            {currentTimeZone}
          </span>
        </div>
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
