import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

type SyndicateInBetaBannerProviderProps = {
  hideBanner: () => void;
  showBanner: boolean;
};

const SyndicateInBetaBannerContext = createContext<
  Partial<SyndicateInBetaBannerProviderProps>
>({});

export const useSyndicateInBetaBannerContext = (): Partial<SyndicateInBetaBannerProviderProps> =>
  useContext(SyndicateInBetaBannerContext);

const SyndicateInBetaBannerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showBanner, setShowBanner] = useState(false);

  // this banner should be shown in V2
  useEffect(() => {
    const showBanner = JSON.parse(localStorage.getItem("showBanner"));
    const currentDate = new Date().getTime();

    if (showBanner == undefined || null) {
      // check whether current date is passed the timestamp
      setShowBanner(true);
    } else {
      if (currentDate > showBanner.timestamp) {
        setShowBanner(true);
        // clear the localStorage
        localStorage.removeItem("showBanner");
      } else {
        setShowBanner(false);
      }
    }

    return () => {
      setShowBanner(false);
    };
  }, [showBanner]);

  const hideBanner = () => {
    // hide the banner for the next 24 hours
    localStorage.setItem(
      "showBanner",
      JSON.stringify({
        show: "false",
        timestamp: new Date().getTime() + 60 * 60 * 24 * 1000,
      }),
    );
    localStorage.setItem("timeUntilNextbanner", "false");
    setShowBanner(false);
  };
  return (
    <SyndicateInBetaBannerContext.Provider
      value={{
        hideBanner,
        showBanner,
      }}
    >
      {children}
    </SyndicateInBetaBannerContext.Provider>
  );
};

export default SyndicateInBetaBannerProvider;
