import React from 'react';
import Image from 'next/image';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { formatAddress } from '@/utils/formatAddress';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import GradientAvatar from '@/components/syndicates/portfolioAndDiscover/portfolio/GradientAvatar';
import {
  RoundCategory,
  TransactionCategory
} from '@/state/erc20transactions/types';
import useWindowSize from '@/hooks/useWindowSize';
import { TokenCollection } from '@/components/distributions/tokenCollection';

type Transaction = 'outgoing' | 'incoming';

interface ITransactionDetails {
  tokenDetails: {
    name: string;
    symbol: string;
    icon?: string;
    amount: string;
  }[];
  transactionType: Transaction;
  isTransactionAnnotated: boolean;
  addresses: string | string[];
  onModal?: boolean;
  category: TransactionCategory;
  companyName?: string;
  round: RoundCategory;
}

const TransactionDetails: React.FC<ITransactionDetails> = ({
  tokenDetails,
  transactionType,
  isTransactionAnnotated,
  addresses,
  onModal = false,
  category,
  companyName,
  round
}) => {
  const {
    web3Reducer: {
      web3: { web3 }
    },
    clubMembersSliceReducer: { clubMembers }
  } = useSelector((state: AppState) => state);

  const getTransactionText = (transactionType: string, onModal: boolean) => {
    if (transactionType === 'outgoing') {
      if (onModal) {
        return 'to';
      }
      return category === 'INVESTMENT' ? 'invested in' : 'sent to';
    } else if (transactionType === 'incoming') {
      if (onModal) {
        return 'from';
      }
      return category === 'DEPOSIT' ? 'deposited by' : 'received from';
    }
  };
  const addGrayToDecimalInput = (str) => {
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

  const AddressIsMember = (address: string) => {
    return (
      clubMembers.filter(
        (member) => member.memberAddress.toLowerCase() === address.toLowerCase()
      ).length !== 0
    );
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
              <TokenCollection numberVisible={3} tokenDetails={tokenDetails} />
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
                    {AddressIsMember(addresses[0]) && (
                      <div className="mx-2 flex items-center">
                        <Image
                          src={'/images/User_Icon.svg'}
                          height={24}
                          width={24}
                        />
                      </div>
                    )}
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
                <div
                  className={`${
                    onModal ? 'sm:text-2xl text-base' : 'text-base'
                  }`}
                >
                  {companyName
                    ? companyName
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

export default TransactionDetails;
