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

type Transaction = 'outgoing' | 'incoming';

interface ITransactionDetails {
  tokenName: string;
  tokenLogo: string;
  tokenSymbol: string;
  transactionType: Transaction;
  isTransactionAnnotated: boolean;
  amount: string;
  address: string;
  onModal?: boolean;
  category: TransactionCategory;
  companyName?: string;
  round: RoundCategory;
}

const TransactionDetails: React.FC<ITransactionDetails> = ({
  tokenName,
  tokenLogo,
  tokenSymbol,
  transactionType,
  isTransactionAnnotated,
  amount,
  address,
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
          <div className="flex">
            {tokenSymbol.toLowerCase() !== 'usd' && (
              <>
                {tokenLogo ? (
                  <Image src={tokenLogo} height={24} width={24} />
                ) : (
                  <GradientAvatar name={tokenName} size={'w-6 h-6'} />
                )}
              </>
            )}
            <div
              className={`flex ml-2 ${
                onModal ? 'sm:text-2xl text-base' : 'text-base'
              }`}
            >
              {addGrayToDecimalInput(floatedNumberWithCommas(amount))}&nbsp;
              {tokenSymbol}
            </div>
          </div>
          <p className={`text-gray-syn4 ${onModal ? 'mx-4' : 'mx-3'}`}>
            {getTransactionText(transactionType, onModal)}
          </p>
          <div className="flex">
            {!onModal &&
            transactionType === 'incoming' &&
            isTransactionAnnotated ? (
              <>
                {AddressIsMember(address) && (
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
                <Image src={'/images/User_Icon.svg'} height={24} width={24} />
              </div>
            ) : null}
            <div
              className={`${onModal ? 'sm:text-2xl text-base' : 'text-base'}`}
            >
              {companyName
                ? companyName
                : !web3.utils.isAddress(address)
                ? address
                : formatAddress(address, 6, 4)}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex justify-center">
            <p className="text-xl">
              {companyName
                ? companyName
                : !web3.utils.isAddress(address)
                ? address
                : formatAddress(address, 6, 4)}
            </p>
            <p className="text-gray-syn4 text-xl ml-2">{round}</p>
          </div>
          <div className={`flex mt-4 text-4.5xl`}>
            {addGrayToDecimalInput(floatedNumberWithCommas(amount))}&nbsp;
            {tokenSymbol}
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionDetails;
