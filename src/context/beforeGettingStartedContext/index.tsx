import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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
  children,
}) => {
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState(false);
  const [showBeforeGettingStarted, setShowBeforeGettingStarted] =
    useState(false);

  useEffect(() => {
    setButtonDisabled(!agreementChecked);
  }, [agreementChecked]);

  useEffect(() => {
    const showBeforeGettingStarted = localStorage.getItem(
      "showBeforeGettingStarted",
    );

    if (showBeforeGettingStarted == undefined || null) {
      setShowBeforeGettingStarted(true);
      localStorage.setItem("showBeforeGettingStarted", "true");
    } else if (showBeforeGettingStarted === "true") {
      setShowBeforeGettingStarted(true);
    } else {
      setShowBeforeGettingStarted(false);
    }

    return () => {
      setShowBeforeGettingStarted(false);
    };
  }, [showBeforeGettingStarted]);

  const hideBeforeGettingStarted = () => {
    setShowBeforeGettingStarted(false);
    localStorage.setItem("showBeforeGettingStarted", "false");
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
        showBeforeGettingStarted,
        hideBeforeGettingStarted,
        agreementChecked,
        error,
        handleClickOutside,
        handleChange,
        buttonDisabled,
      }}
    >
      {children}
    </BeforeGettingStartedContext.Provider>
  );
};
export default BeforeGettingStartedProvider;
