import { useRouter } from 'next/router';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { useDemoMode } from '@/hooks/useDemoMode';

type BeforeGettingStartedProps = {
  showBeforeGettingStarted: boolean;
  agreementChecked: boolean;
  hideBeforeGettingStarted: () => void;
  error: boolean;
  handleClickOutside;
  handleChange;
  buttonDisabled;
};

const BeforeGettingStartedContext = createContext<
  Partial<BeforeGettingStartedProps>
>({});

export const useBeforeGettingStartedContext =
  (): Partial<BeforeGettingStartedProps> =>
    useContext(BeforeGettingStartedContext);

const BeforeGettingStartedProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState(false);
  const [showBeforeGettingStarted, setShowBeforeGettingStarted] =
    useState(false);

  const {
    query: { clubAddress }
  } = useRouter();
  const isDemoMode = useDemoMode();

  useEffect(() => {
    setButtonDisabled(!agreementChecked);
  }, [agreementChecked]);

  useEffect(() => {
    // ChoiceDAO club addresses to exclude
    const choiceDAOAddresses = [
      '0x5d185575D086F97a42D8cB38B04f0e5725805DC1',
      '0x1a4bd62b6d69fdcf1a79546382e7dbc40e78d339'
    ];

    if (
      !clubAddress ||
      isDemoMode ||
      choiceDAOAddresses.indexOf(clubAddress as string) > -1
    )
      return;

    const { showBeforeGettingStarted } =
      JSON.parse(localStorage.getItem(clubAddress as string)) || {};

    if (showBeforeGettingStarted == undefined || null) {
      setShowBeforeGettingStarted(true);
      localStorage.setItem(
        clubAddress as string,
        JSON.stringify({ showBeforeGettingStarted: true })
      );
    } else if (showBeforeGettingStarted === true) {
      setShowBeforeGettingStarted(true);
    } else {
      setShowBeforeGettingStarted(false);
    }

    return () => {
      setShowBeforeGettingStarted(false);
      setAgreementChecked(false);
    };
  }, [showBeforeGettingStarted, clubAddress]);

  const hideBeforeGettingStarted = () => {
    setShowBeforeGettingStarted(false);
    localStorage.setItem(
      clubAddress as string,
      JSON.stringify({ showBeforeGettingStarted: false })
    );
  };

  const handleClickOutside = () => {
    if (!agreementChecked) {
      setError(true);
    }
  };

  const handleChange = () => {
    setAgreementChecked(!agreementChecked);
    setError(false);
  };

  return (
    <BeforeGettingStartedContext.Provider
      value={{
        showBeforeGettingStarted: showBeforeGettingStarted,
        hideBeforeGettingStarted,
        agreementChecked,
        error,
        handleClickOutside,
        handleChange,
        buttonDisabled
      }}
    >
      {children}
    </BeforeGettingStartedContext.Provider>
  );
};
export default BeforeGettingStartedProvider;
