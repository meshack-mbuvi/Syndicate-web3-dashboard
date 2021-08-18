import { SkeletonLoader } from "@/components/skeletonLoader";
import { setDepositTokenDetails } from "@/redux/actions/createSyndicate/syndicateOnChainData/tokenAndDepositsLimits";
import { RootState } from "@/redux/store";
// list of prod tokens
import { coinsList } from "@/TokensList/coinsList";
// test coins list
// to be used only for testing purposes
import { testCoinsList } from "@/TokensList/testCoinsList";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TokenSearchInput } from "./TokenSearchInput";

const debugging = process.env.NEXT_PUBLIC_DEBUG;

interface ICoinProps {
  symbol: string;
  name: string;
  contractAddress: string;
  icon: string;
  decimal: number;
  default?: boolean;
}

interface TokenProps extends ICoinProps {
  toggleTokenSelect: () => void;
}

// render each token item inside the token select drop-down
const TokenItem = (props: TokenProps) => {
  const { symbol, name, icon, toggleTokenSelect } = props;

  const dispatch = useDispatch();

  // push deposit token details to the redux store
  const storeDepositTokenDetails = async (tokenDetails: TokenProps) => {
    const { symbol, name, contractAddress, icon, decimal } = tokenDetails;

    dispatch(
      setDepositTokenDetails({
        depositTokenAddress: contractAddress,
        depositTokenSymbol: symbol,
        depositTokenLogo: icon,
        depositTokenName: name,
        depositTokenDecimals: decimal,
      }),
    );

    // close the token select menu after a token is clicked
    toggleTokenSelect();
  };
  return (
    <button
      className="flex justify-between items-center w-full py-2 px-4 rounded-md cursor-pointer hover:bg-gray-darkInput focus:bg-gray-darkInput transition-all mb-1"
      onClick={() => storeDepositTokenDetails({ ...props })}
    >
      <div className="flex justify-start items-center">
        <img src={icon} alt={icon} width={20} height={20} />
        <p className="text-white text-sm sm:text-base ml-3">{name}</p>
      </div>
      <p className="text-gray-3 text-sm sm:text-base uppercase">{symbol}</p>
    </button>
  );
};

export const DepositTokenSelect: React.FC<{ toggleTokenSelect: () => void }> = (
  props,
) => {
  const [tokensList, setTokensList] = useState<ICoinProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noTokenFound, setNoTokenFound] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const {
    web3: { web3 },
  } = useSelector((state: RootState) => state.web3Reducer);

  // set correct tokens list to use
  let tokensListToUse: ICoinProps[];
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
      } else if (web3.utils.isAddress(searchTerm)) {
        const contractAddressSearchResults = tokensListToUse.filter((token) =>
          token.contractAddress.toLowerCase().includes(searchKeyword),
        );

        if (contractAddressSearchResults.length) {
          setTokensList(contractAddressSearchResults);
          setNoTokenFound(false);
        } else {
          setShowLoader(true);
          setNoTokenFound(false);

          getCoinFromContractAddress(searchTerm).then((coinInfo) => {
            if (coinInfo.symbol) {
              setShowLoader(false);
              setTokensList([
                {
                  symbol: coinInfo.symbol,
                  name: coinInfo.name,
                  contractAddress: searchTerm,
                  icon: coinInfo.logo,
                  decimal: coinInfo.decimals,
                },
              ]);
            } else {
              // fail gracefully when there is an error fetching coin info from coingecko
              setShowLoader(false);
              setTokensList([]);
              setNoTokenFound(true);
            }
          })
        }
      } else {
        setTokensList([]);
        setNoTokenFound(true);
      }
    } else {
      // populate the list with default tokens if there's no search term
      const defaultTokens = tokensListToUse.filter(
        (token: ICoinProps) => token.default,
      );
      setTokensList(defaultTokens);
    }
  }, [searchTerm, tokensListToUse, web3.utils]);
  return (
    <div
      className="flex flex-col p-4 rounded-md bg-gray-darkBackground border-6 border-gray-darkBackground focus:outline-none"
    >
      <TokenSearchInput setSearchTerm={setSearchTerm} />
      {searchTerm ? null : (
        <p className="text-xs sm:text-sm text-gray-3 uppercase pl-4 mb-2 tracking-wider">
          top stablecoins
        </p>
      )}
      <div className="my-2 overflow-y-auto">
        {showLoader ? (
          <SkeletonLoader width="full" height="8" />
        ) : tokensList.length ? (
          tokensList.map((coin, index) => {
            const { symbol, name, contractAddress, icon, decimal } = coin;
            return (
              <TokenItem
                {...{ symbol, name, contractAddress, icon, decimal }}
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
