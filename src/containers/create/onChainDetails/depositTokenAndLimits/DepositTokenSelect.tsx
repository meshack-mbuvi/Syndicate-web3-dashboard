import { setDepositTokenDetails } from "@/redux/actions/createSyndicate/syndicateOnChainData/tokenAndDepositsLimits";
// list of prod tokens
import { coinsList } from "@/TokensList/coinsList";
// test coins list
// to be used only for testing purposes
import { testCoinsList } from "@/TokensList/testCoinsList";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Web3 from "web3";
import { TokenSearchInput } from "./TokenSearchInput";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require("human-standard-token-abi");
const debugging = process.env.NEXT_PUBLIC_DEBUG;

interface TokenProps {
  symbol: string;
  name: string;
  contractAddress: string;
  icon: string;
  toggleTokenSelect;
}

// render each token item inside the token select drop-down
const TokenItem = (props: TokenProps) => {
  const { symbol, name, icon, toggleTokenSelect } = props;

  const dispatch = useDispatch();

  // push deposit token details to the redux store
  const storeDepositTokenDetails = async (tokenDetails) => {
    const { symbol, name, contractAddress, icon } = tokenDetails;

    // Our test web3 instances uses the Rinkeby network which won't work
    // for mainnet tokens.
    // this web3 instantiation should be updated once we switch to production.
    let PROVIDER_URL =
      "https://mainnet.infura.io/v3/9d91aad0f1bf44dbba8339d64faf2e2b";
    if (debugging === "true") {
      PROVIDER_URL = process.env.NEXT_PUBLIC_INFURA_ENDPOINT;
    }

    const web3 = new Web3(PROVIDER_URL);
    // get deposit token decimals
    const tokenContractInstance = new web3.eth.Contract(abi, contractAddress);
    const tokenDecimals = await tokenContractInstance.methods.decimals().call();

    dispatch(
      setDepositTokenDetails({
        depositTokenAddress: contractAddress,
        depositTokenSymbol: symbol,
        depositTokenLogo: icon,
        depositTokenName: name,
        depositTokenDecimals: +tokenDecimals,
      }),
    );

    // close the token select menu after a token is clicked
    toggleTokenSelect();
  };
  return (
    <button
      className="flex justify-between items-center w-full py-2 px-4 rounded-md cursor-pointer hover:bg-gray-darkInput focus:bg-gray-darkInput transition-all"
      onClick={() => storeDepositTokenDetails({ ...props })}
    >
      <div className="flex justify-start items-center">
        <Image src={icon} width={20} height={20} />
        <p className="text-white text-sm sm:text-base ml-3">{name}</p>
      </div>
      <p className="text-gray-3 text-sm sm:text-base uppercase">{symbol}</p>
    </button>
  );
};

export const DepositTokenSelect = (props: { toggleTokenSelect: Function }) => {
  const [tokensList, setTokensList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noTokenFound, setNoTokenFound] = useState(false);

  // set correct tokens list to use
  let tokensListToUse;
  if (debugging === "true") {
    tokensListToUse = testCoinsList;
  } else {
    tokensListToUse = coinsList;
  }

  // handle token search
  useEffect(() => {
    if (searchTerm) {
      const searchKeyword = searchTerm.toLowerCase().trim();
      // users are allowed to search by name or symbol
      const searchResults = tokensListToUse.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchKeyword) ||
          token.name.toLowerCase().includes(searchKeyword),
      );
      if (searchResults.length) {
        setTokensList(searchResults);
        setNoTokenFound(false);
      } else {
        setTokensList([]);
        setNoTokenFound(true);
      }
    } else {
      // populate the list with default tokens if there's no search term
      const defaultTokens = tokensListToUse.filter((token) => token.default);
      setTokensList(defaultTokens);
    }
  }, [searchTerm, tokensListToUse]);
  return (
    <div
      className="flex flex-col p-4 rounded-md bg-gray-darkBackground border-6 border-gray-darkBackground focus:outline-none"
      onMouseLeave={() => props.toggleTokenSelect()}
    >
      <TokenSearchInput setSearchTerm={setSearchTerm} />
      {searchTerm ? null : (
        <p className="text-xs sm:text-sm text-gray-3 uppercase pl-4 mb-2 tracking-wider">
          top stablecoins
        </p>
      )}
      <div className="my-2 overflow-y-auto">
        {tokensList.length ? (
          tokensList.map((coin, index) => {
            const { symbol, name, contractAddress, icon } = coin;
            return (
              <TokenItem
                {...{ symbol, name, contractAddress, icon }}
                key={index}
                toggleTokenSelect={props.toggleTokenSelect}
              />
            );
          })
        ) : noTokenFound ? (
          <div className="flex flex-col justify-center w-full h-full items-center">
            <ExclamationCircleIcon className="h-10 w-10 mb-2" />
            <p className="text-sm text-gray-3">No token found</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
