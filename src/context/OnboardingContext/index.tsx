import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type OnboardingProps = {
    showInvestorOnboarding: boolean;
    hideInvestorOnboarding: () => void;
};

const OnboardingContext = createContext<Partial<OnboardingProps>>({})

export const useOnboardingContext = (): Partial<OnboardingProps> => useContext(OnboardingContext)

const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
    children
}) => {

    const [showInvestorOnboarding, setShowInvestorOnboarding] = useState(false);

    useEffect(() => {
        const showInvestorOnboarding = localStorage.getItem("showInvestorOnboarding")

        // Set investor onboarding visibility
        if (showInvestorOnboarding == undefined || null) {
            setShowInvestorOnboarding(true);
            localStorage.setItem("showInvestorOnboarding", "true");
        }
        else if (showInvestorOnboarding === "true") {
            setShowInvestorOnboarding(true);
        }
        else {
            setShowInvestorOnboarding(false);
        }
        
        return () => {
            setShowInvestorOnboarding(false);
        };
    }, [showInvestorOnboarding]);

    const hideInvestorOnboarding = () => {
        setShowInvestorOnboarding(false)
        localStorage.setItem("showInvestorOnboarding", "false");
    }

    return (
        <OnboardingContext.Provider 
            value={{
                showInvestorOnboarding,
                hideInvestorOnboarding,
            }}>
            {children}
        </OnboardingContext.Provider>
    );
}
export default OnboardingProvider;