import { TokenCollection } from '@/components/distributions/tokenCollection';
import GradientAvatar from '@/components/syndicates/portfolioAndDiscover/portfolio/GradientAvatar';
import { getMemberBalance } from '@/hooks/clubs/useClubOwner';
import useWindowSize from '@/hooks/useWindowSize';
import { AppState } from '@/state';
import {
  RoundCategory,
  TransactionCategory
} from '@/state/erc20transactions/types';
import { formatAddress } from '@/utils/formatAddress';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';

export type Transaction = 'outgoing' | 'incoming';

export interface TokenDetails {
  name: string;
  symbol: string;
  icon?: string;
  amount: string;
}

interface IBatchTransactionDetails {
  tokenDetails: Array<TokenDetails>;
  transactionType: Transaction;
  isAnnotationsModalShown: boolean;
  isTransactionAnnotated: boolean;
  addresses: string | string[];
  onModal?: boolean;
  category: TransactionCategory;
  companyName?: string;
  round?: RoundCategory | undefined;
  contractAddress: string;
  numClubMembers?: number;
}

const BatchTransactionDetails: React.FC<IBatchTransactionDetails> = ({
  tokenDetails,
  transactionType,
  isTransactionAnnotated,
  isAnnotationsModalShown,
  addresses,
  onModal = false,
  category,
  companyName,
  round,
  contractAddress,
  numClubMembers
}) => {
  const {
    web3Reducer: {
      web3: { web3, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  // @ts-expect-error TS(7030): Not all code paths return a value.
  const getTransactionText = (transactionType: string, onModal: boolean) => {
    if (transactionType === 'outgoing') {
      if (onModal) {
        return 'to';
      }
      return category === 'INVESTMENT'
        ? 'invested in'
        : category === 'DISTRIBUTION'
        ? 'distributed to'
        : 'sent to';
    } else if (transactionType === 'incoming') {
      if (onModal) {
        return 'from';
      }
      return category === 'DEPOSIT' ? 'deposited by' : 'received from';
    }
  };
  const addGrayToDecimalInput = (str: any) => {
    if (typeof str !== 'string') {
      str.toString();
    }
    const [wholeNumber, decimalPart] = str.split('.');
    return (
      <div className="flex">
        {wholeNumber ? <p className="text-white">{wholeNumber}</p> : null}
        {decimalPart ? <p className="text-gray-syn4">.{decimalPart}</p> : null}
      </div>
    );
  };

  const AddressIsMember = async (address: string) => {
    return await getMemberBalance(
      contractAddress,
      address,
      web3,
      activeNetwork
    ).then((balance) => balance > 0);
  };

  const { width } = useWindowSize();

  return (
    <>
      {category !== 'OFF_CHAIN_INVESTMENT' ? (
        <div className={`flex items-center ${width < 400 ? 'flex-col' : ''}`}>
          {/* Outgoing token(s) */}
          <div className="flex items-center">
            {tokenDetails.length === 1 ? ( // a distribution can have more token details
              <>
                {tokenDetails[0].symbol.toLowerCase() !== 'usd' && (
                  <>
                    {tokenDetails[0].icon ? (
                      <Image
                        src={tokenDetails[0].icon}
                        height={24}
                        width={24}
                      />
                    ) : (
                      <GradientAvatar
                        name={tokenDetails[0].name}
                        size={'w-6 h-6'}
                      />
                    )}
                  </>
                )}
                <div
                  className={`flex ml-2 ${
                    onModal ? 'sm:text-2xl text-base' : 'text-base'
                  }`}
                >
                  {addGrayToDecimalInput(
                    floatedNumberWithCommas(tokenDetails[0].amount)
                  )}
                  &nbsp;
                  {tokenDetails[0].symbol}
                </div>
              </>
            ) : (
              <TokenCollection
                numberVisible={3}
                isAnnotationsModalShown={isAnnotationsModalShown}
                tokenDetails={tokenDetails}
              />
            )}
          </div>
          {/* Transaction direction: e.g "invested in", "to", "from" ... */}
          <p className={`text-gray-syn4 ${onModal ? 'mx-4' : 'mx-3'}`}>
            {getTransactionText(transactionType, onModal)}
          </p>
          {/* Destination */}
          <div className="flex">
            {addresses.length === 1 ? ( // a distribution can have multiple destination addresses
              <>
                {!onModal &&
                transactionType === 'incoming' &&
                isTransactionAnnotated ? (
                  <>
                    {
                      // @ts-expect-error TS(2801): This condition will always return true since this 'Promise<boolean>' is always defined.
                      AddressIsMember(addresses[0]) && (
                        <div className="mx-2 flex items-center">
                          <Image
                            src={'/images/User_Icon.svg'}
                            height={24}
                            width={24}
                          />
                        </div>
                      )
                    }
                  </>
                ) : null}
                {onModal && category === 'DEPOSIT' ? (
                  <div className="mr-2 flex items-center">
                    <Image
                      src={'/images/User_Icon.svg'}
                      height={24}
                      width={24}
                    />
                  </div>
                ) : null}
                {!onModal && category === 'DISTRIBUTION' && (
                  <div className="text-base">
                    {numClubMembers === 1
                      ? `${numClubMembers} member`
                      : `${numClubMembers} members`}
                  </div>
                )}
                <div
                  className={`${
                    onModal ? 'sm:text-2xl text-base' : 'text-base'
                  }`}
                >
                  {companyName
                    ? companyName
                    : !onModal && category === 'DISTRIBUTION'
                    ? ''
                    : onModal &&
                      category === 'DISTRIBUTION' &&
                      numClubMembers === 1
                    ? `${numClubMembers} member`
                    : onModal &&
                      category === 'DISTRIBUTION' &&
                      numClubMembers !== 1
                    ? `${numClubMembers} members`
                    : !web3.utils.isAddress(addresses[0])
                    ? addresses[0]
                    : formatAddress(addresses[0], 6, 4)}
                </div>
              </>
            ) : (
              <h2>{addresses.length} Members</h2>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex justify-center">
            <p className="text-xl">
              {companyName
                ? companyName
                : !web3.utils.isAddress(addresses[0])
                ? addresses[0]
                : formatAddress(addresses[0], 6, 4)}
            </p>
            <p className="text-gray-syn4 text-xl ml-2">{round}</p>
          </div>
          <div className={`flex mt-4 text-4.5xl`}>
            {addGrayToDecimalInput(
              floatedNumberWithCommas(tokenDetails[0].amount)
            )}
            &nbsp;
            {tokenDetails[0].symbol}
          </div>
        </div>
      )}
    </>
  );
};

export default BatchTransactionDetails;
