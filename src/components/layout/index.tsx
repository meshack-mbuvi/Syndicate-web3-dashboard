import {
  setLibrary,
  storeSyndicateInstance,
} from "@/redux/actions/web3Provider";
import { RootState } from "@/redux/store";
import { useWeb3React } from "@web3-react/core";
import { parse } from "flatted";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DepositsPageBanner,
  SyndicateInBetaBanner,
} from "src/components/banners";
import ConnectWallet from "src/components/connectWallet";
import Header from "src/components/navigation/header";
import Syndicate from "src/contracts/Syndicate.json";
import { injected } from "../connectWallet/connectors";
import SEO from "../seo";

// Global variables

const contractAddress = process.env.NEXT_PUBLIC_SYNDICATE_CONTRACT_ADDRESS;
const Web3 = require("web3");
const daiABI = require("src/utils/abi/dai");
const daiContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
/**
 * set up web3 event listener here
 * we can use to get access to all events emitted by the contract
 *
 */
const web3 = new Web3(
  Web3.givenProvider || `${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`
);

// set up DAI contract
const daiContract = new web3.eth.Contract(daiABI, daiContractAddress);

const syndicateContractInstance = new web3.eth.Contract(
  // @ts-ignore
  Syndicate.abi,
  contractAddress
);

export const Layout = ({ children, backLink = null }) => {
  const { activate, library, account } = useWeb3React();
  const dispatch = useDispatch();

  const {
    web3Reducer: { syndicateAction },
  } = useSelector((state: RootState) => state);

  const { deposit, generalView } = syndicateAction;
  const setWeb3 = async () => {
    dispatch(storeSyndicateInstance(syndicateContractInstance));

    if (library) {
      try {
        return dispatch(
          setLibrary({
            library,
            account,
            syndicateContractInstance,
            daiContract,
            web3,
          })
        );
      } catch (error) {
        // clear cache if we get here
        localStorage.removeItem("cache");
      }
    }
  };

  useEffect(() => {
    const cacheWallet = localStorage.getItem("cache") || null;

    if (cacheWallet) {
      const parseCasheWallet = parse(cacheWallet);
      const provider = parseCasheWallet.library.provider || null;

      if (provider.isMetaMask) {
        activateProvider(injected).then(() => {
          setLibrary({
            library: provider.library,
            account: provider.selectedAddress,
            syndicateContractInstance,
            daiContract,
            web3,
          });
        });
      }
    }
  }, []);

  useEffect(() => {
    setWeb3();
  }, [activate, library, account]);

  /**
   * This activate any provide passed to the function where
   * provider can be injected provider, walletConnect or gnosis wallet provider
   * @param {*} provider
   */
  const activateProvider = async (provider) => {
    try {
      // dispatch action to start loader
      await activate(provider, undefined, true);
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
      <Header backLink={backLink}/>
      <div className="sticky top-20 z-10">
        <SyndicateInBetaBanner />
        {deposit || generalView ? <DepositsPageBanner key={2} /> : null}
      </div>
      <div className="flex w-full flex-col sm:flex-row md:py-32 px-4 md:px-6 z-0">
        {children}
      </div>
      <ConnectWallet />
    </div>
  );
};

export default Layout;
