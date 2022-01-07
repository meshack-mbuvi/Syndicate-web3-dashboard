import React from "react";
import Image from "next/image";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { formatAddress } from "@/utils/formatAddress";
import { AppState } from "@/state";
import { useSelector } from "react-redux";
import GradientAvatar from "@/components/syndicates/portfolioAndDiscover/portfolio/GradientAvatar";
import { TransactionCategory } from "@/state/erc20transactions/types";

type Transaction = "outgoing" | "incoming";

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
}) => {
  const {
    web3Reducer: {
      web3: { web3 },
    },
    clubMembersSliceReducer: { clubMembers },
  } = useSelector((state: AppState) => state);

  const getTransactionText = (transactionType: string, onModal: boolean) => {
    if (transactionType === "outgoing") {
      if (onModal) {
        return "to";
      }
      return category === "INVESTMENT" ? "invested in" : "sent to";
    } else if (transactionType === "incoming") {
      if (onModal) {
        return "from";
      }
      return category === "DEPOSIT" ? "deposited by" : "received from";
    }
  };
  const addGrayToDecimalInput = (str) => {
    if (typeof str !== "string") {
      str.toString();
    }
    const [wholeNumber, decimalPart] = str.split(".");
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
        (member) =>
          member.memberAddress.toLowerCase() === address.toLowerCase(),
      ).length !== 0
    );
  };

  return (
    <div className="flex items-center">
      {tokenLogo ? (
        <Image src={tokenLogo} height={24} width={24} />
      ) : (
        <GradientAvatar name={tokenName} size={"w-6 h-6"} />
      )}
      <div className={`flex ml-2 ${onModal ? "text-2xl" : "text-base"}`}>
        {addGrayToDecimalInput(floatedNumberWithCommas(amount))}&nbsp;
        {tokenSymbol}
      </div>
      <p className={`text-gray-syn4 ${onModal ? "mx-4" : "mx-3"}`}>
        {getTransactionText(transactionType, onModal)}
      </p>
      {!onModal && transactionType === "incoming" && isTransactionAnnotated ? (
        <>
          {AddressIsMember(address) && (
            <div className="mx-2 flex items-center">
              <Image src={"/images/User_Icon.svg"} height={24} width={24} />
            </div>
          )}
        </>
      ) : null}
      <p className={`${onModal ? "text-2xl" : "text-base"}`}>
        {companyName
          ? companyName
          : !web3.utils.isAddress(address)
          ? address
          : formatAddress(address, 6, 4)}
      </p>
    </div>
  );
};

export default TransactionDetails;
