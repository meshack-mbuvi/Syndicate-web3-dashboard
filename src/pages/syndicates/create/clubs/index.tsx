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
          <div className="container mx-auto w-full">
            <div className="h4 text-center pb-16">
              Create an investment club
            </div>
            <div
              className=
                "flex justify-center w-full "
              
            >
              <div className="flex-1 w-1/4" />
              <div className="w-3/4">
                <MainContent>
                  <div className="flex-grow flex overflow-y-auto justify-between h-full no-scroll-bar">
                    <div className="flex flex-col w-full">
                      {steps[currentStep].component}
                      <div className="w-2/3">
                        <InvestmentClubCTAs />
                      </div>
                    </div>
                  </div>
                </MainContent>
              </div>
            </div>
          </div>
        )}
      </>
    </Layout>
  );
};

export default CreateInvestmentClub;
