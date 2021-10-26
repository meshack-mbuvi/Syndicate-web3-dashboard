import Layout from "@/components/layout";
import WalletNotConnected from "@/components/walletNotConnected";
import { MainContent } from "@/containers/create/shared";
import InvestmentClubCTAs from "@/containers/create/shared/controls/investmentClubCTAs";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { useSyndicateInBetaBannerContext } from "@/context/SyndicateInBetaBannerContext";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Head from "@/components/syndicates/shared/HeaderTitle";

const CreateInvestmentClub: React.FC = () => {
  const { steps, currentStep } = useCreateInvestmentClubContext();

  const { showBanner } = useSyndicateInBetaBannerContext();

  const {
    web3Reducer: { web3 },
  } = useSelector((state: RootState) => state);

  const { account } = web3;

  return (
    <Layout>
      <Head title="Create Investment Club - Syndicate" />
      <>
        {!account ? (
          <WalletNotConnected />
        ) : (
          <>
            <div
              className={
                "container mx-auto flex fixed top-0 h-screen justify-between w-full " +
                `${showBanner ? "pt-36" : "pt-24"}`
              }
            >
              <div className="flex-1 w-1/6m" />

              <MainContent>
                <div className="h4 text-center pb-16">Create an investment club</div>
                <div className="flex-grow flex overflow-y-auto justify-between h-full no-scroll-bar">
                  <div className="flex flex-col w-full">
                    {steps[currentStep].component}
                    <InvestmentClubCTAs />
                  </div>
                </div>
                <div className="flex flex-row items-center space-x-4 border-t-1 border-gray-steelGrey h-20 text-gray-lightManatee">
                  <div className="w-5 h-5" ><img className="w-5 h-5" src="/images/lightbulb.svg" alt="" /></div>
                  <div>Changing these settings in the future will require a signed transaction with gas.</div>
                </div>
              </MainContent>

              <div className="flex-1 w-1/6m" />
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default CreateInvestmentClub;
