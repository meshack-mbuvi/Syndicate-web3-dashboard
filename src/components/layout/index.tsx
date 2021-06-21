import {
  setLibrary,
  storeSyndicateInstance,
} from "@/redux/actions/web3Provider";
import { parse } from "flatted";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  DepositsPageBanner,
  SyndicateInBetaBanner,
} from "src/components/banners";
import ConnectWallet from "src/components/connectWallet";
import Header from "src/components/navigation/header";
import Syndicate from "src/contracts/Syndicate.json";
import SEO from "../seo";

// Global variables

const contractAddress = process.env.NEXT_PUBLIC_SYNDICATE_CONTRACT_ADDRESS;
const Web3 = require("web3");
/**
 * set up web3 event listener here
 * we can use to get access to all events emitted by the contract
 *
 */
const web3 = new Web3(
  Web3.givenProvider || `${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`
);

const syndicateContractInstance = new web3.eth.Contract(
  // @ts-ignore
  Syndicate.abi,
  contractAddress
);

export const Layout = ({ children, backLink = null }) => {
  const [cachedWalletData, setCachedWalletData] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const showDepositsPageBanner =
    router.pathname.endsWith("deposit") || router.pathname.endsWith("details");

  useEffect(() => {
    if (cachedWalletData) {
      activateProvider(cachedWalletData);
    }
  }, [cachedWalletData]);

  useEffect(() => {
    const cacheWallet = localStorage.getItem("cache") || null;
    if (cacheWallet) {
      const parseCacheWallet = parse(cacheWallet);
      setCachedWalletData(parseCacheWallet);
    }
  }, []);

  /**
   * This activate any provide passed to the function where
   * provider can be injected provider, walletConnect or gnosis wallet provider
   * @param {*} provider
   */
  const activateProvider = async (cachedWalletData) => {
    const { providerName, account } = cachedWalletData;
    dispatch(storeSyndicateInstance(syndicateContractInstance));

    try {
      switch (providerName) {
        // we have several providers with different provider names in
        // /components/connectWallet/connectors.ts
        case "Injected":
          return dispatch(
            setLibrary({
              account,
              syndicateContractInstance,
              web3,
              providerName,
            })
          );
      }
    } catch (error) {
      // clear cache if we get here
      localStorage.removeItem("cache");
    }
  };

  return (
    <div>
      <SEO
        keywords={[`next`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <Header backLink={backLink} />
      <div className="sticky top-20 z-10">
        <SyndicateInBetaBanner />
        {showDepositsPageBanner && <DepositsPageBanner key={2} />}
      </div>
      <div className="flex w-full flex-col sm:flex-row md:py-32 px-4 md:px-6 z-0">
        {children}
      </div>
      <ConnectWallet />
    </div>
  );
};

export default Layout;
