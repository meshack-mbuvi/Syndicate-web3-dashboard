import {
  setLibrary,
  storeSyndicateInstance,
} from "@/redux/actions/web3Provider";
import { useWeb3React } from "@web3-react/core";
import { parse } from "flatted";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import {
  DepositsPageBanner,
  SyndicateInBetaBanner,
} from "src/components/banners";
import ConnectWallet from "src/components/connectWallet";
import Header from "src/components/navigation/header";
import Syndicate from "src/contracts/Syndicate.json";
import { injected } from "../connectWallet/connectors";
import SEO from "../seo";

const contractAddress = process.env.NEXT_PUBLIC_SYNDICATE_CONTRACT_ADDRESS;
const Web3 = require("web3");
const daiABI = require("src/utils/abi/dai");
const daiContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";

export const Layout = ({ children, syndicateAction }) => {
  const { activate, library, account } = useWeb3React();
  const dispatch = useDispatch();

  const { deposit, generalView } = syndicateAction;
  const setWeb3 = async () => {
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

    let contractVersion = 0;

    dispatch(storeSyndicateInstance(syndicateContractInstance));

    try {
      // This function does not exist in the older contract version
      if (syndicateContractInstance.methods?.getContractVersion) {
        const version = await syndicateContractInstance.methods
          .getContractVersion()
          .call();

        contractVersion = parseInt(version);
      }
    } catch (error) {
      // This section is reached when the function does not exist in the deployed contract.
      // we set the version to 0
      contractVersion = 0;
    }

    if (library) {
      // set up DAI contract
      const daiContract = new web3.eth.Contract(daiABI, daiContractAddress);

      try {
        return dispatch(
          setLibrary({
            library,
            account,
            syndicateContractInstance,
            daiContract,
            web3,
            contractVersion,
          })
        );
      } catch (error) {
        // clear cache if we get here
        localStorage.removeItem("cache");
      }
    }
  };

  useEffect(() => {
    setWeb3();
  }, [activate, library, account]);

  useEffect(() => {
    const cacheWallet = localStorage.getItem("cache") || null;

    if (cacheWallet) {
      const parseCasheWallet = parse(cacheWallet);
      const provider = parseCasheWallet.library.provider || null;
      if (provider.isMetaMask) {
        activateProvider(injected).then(() => {});
      }
    }
  }, []);

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
      <Header />
      <div className="sticky top-20 z-10">
        {/* This banner should be shown in V2 */}
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

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const mapStateToProps = ({ web3Reducer: { syndicateAction } }) => {
  return {
    syndicateAction,
  };
};

Layout.propTypes = {
  syndicateAction: PropTypes.object,
};

export default connect(mapStateToProps)(Layout);
