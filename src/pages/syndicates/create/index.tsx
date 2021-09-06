import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "@/components/layout";
import Head from "src/components/syndicates/shared/HeaderTitle";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import WalletNotConnected from "@/components/walletNotConnected";
import SyndicateTemplates from "@/containers/create/syndicateTemplates";
import { ConnectModal } from "@/components/connectWallet/connectModal";
import { Spinner } from "@/components/shared/spinner";
import { useFirstRender } from "@/components/syndicates/hooks/useFirstRender";

const Create: React.FC = () => {
  const {
    web3Reducer: {
      web3: { account },
    },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: RootState) => state);

  const router = useRouter();
  const firstRender = useFirstRender();

  const [accountIsManager, setAccountIsManager] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const getSyndicates = async (GetterLogicContract: any) => {
    setLoading(true);
    // get syndicate managed by connected account
    const { isManager } = await GetterLogicContract.getManagerInfo(account);
    if (isManager) {
      setAccountIsManager(true);
    } else {
      setAccountIsManager(false);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (syndicateContracts?.GetterLogicContract && account && !firstRender) {
      getSyndicates(syndicateContracts.GetterLogicContract);
    }
  }, [account]);

  useEffect(() => {
    // redirect to the syndicates page if account already manages a syndicate.
    if (accountIsManager) {
      router.replace("/syndicates");
    }
  }, [accountIsManager, router]);

  const closeLoader = () => {
    return;
  };

  return (
    <Layout>
      <ConnectModal
        {...{
          show: loading,
          showCloseButton: false,
          closeModal: closeLoader,
          height: "h-80",
        }}
      >
        <div className="h-3/4 flex flex-col items-center justify-center text-base">
          <Spinner height="h-16" width="w-16" />
          <p className="mt-1">Fetching syndicates, please wait...</p>
        </div>
      </ConnectModal>
      <Head title="Choose a template" />
      <>
        {!account ? (
          <WalletNotConnected />
        ) : (
          <>
            <div
              id="main-container"
              className="container mx-auto flex flex-col justify-between w-full"
            >
              <div className="mb-6 leading-8 w-full text-center">
                <span className="text-1.5xl">
                  Choose your type of syndicate
                </span>
              </div>
              <div id="syndicate-templates" className="flex justify-center">
                <SyndicateTemplates />
              </div>
              <div id="or-option" className="py-6 w-full text-center">
                <span className="text-gray-lightSlate font-bold">OR</span>
              </div>
              <div
                id="custom-syndicate"
                className="w-full flex items-center justify-center"
              >
                <Link href="/syndicates/create/custom">
                  <a className="flex items-center justify-center rounded-md border border-gray-inactive hover:border-blue w-fit-content py-3 px-8">
                    <span className="text-lg">Custom syndicate</span>
                    <span>
                      <img
                        className="w-4 h-4 ml-3"
                        src="/images/chevron-right.svg"
                      />
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default Create;
