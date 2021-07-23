import { RootState } from "@/redux/store";
import { web3 } from "@/utils";
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWeiAmount, onlyUnique } from "src/utils/conversions";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";
import { ifRows } from "./interfaces";

const BN = web3.utils.BN;

const GetClaimedDistributions = ({
  row: { syndicateAddress, depositERC20TokenSymbol, tokenDecimals },
}: ifRows): JSX.Element => {
  const {
    web3Reducer: { web3: web3Wrapper },
    initializeContractsReducer: {
      syndicateContracts: { DepositLogicContract, DistributionLogicContract },
    },
  } = useSelector((state: RootState) => state);

  const { account, web3 } = web3Wrapper;

  const [
    depositWithdrawalsDetails,
    setDepositWithdrawalsDetails,
  ] = useState<any>([]);
  const [
    distributionsWithdrawalDetails,
    setDistributionsWithdrawalDetails,
  ] = useState<any>([]);

  /**
   * when syndicateContracts are initialized fully, retrieve syndicate
   * memberInfo
   */
  useEffect(() => {
    getMemberDistributionsWithdrawalEvents();
    getMemberDepositsWithdrawalEvents();
  }, [DepositLogicContract, DistributionLogicContract, account]);

  // get events where member withdrew their deposits
  const getMemberDepositsWithdrawalEvents = async () => {
    if (syndicateAddress === account) return "-";

    const memberDepositsWithdrawalEvents = await DepositLogicContract.getMemberDepositEvents(
      "DepositRemoved",
      {
        syndicateAddress: web3.utils.toChecksumAddress(syndicateAddress),
        memberAddress: account,
      },
    );

    if (memberDepositsWithdrawalEvents.length) {
      const depositERC20WithdrawalAmounts = [];
      for (let i = 0; i < memberDepositsWithdrawalEvents.length; i++) {
        const { amount } = memberDepositsWithdrawalEvents[i].returnValues;

        depositERC20WithdrawalAmounts.push(
          getWeiAmount(amount.toString(), +tokenDecimals, false),
        );
      }

      // get total deposits withdrawn.
      const reducerFunc = (accumulator, currentValue) =>
        new BN(accumulator).add(new BN(currentValue)).toString();

      const totalDepositTokenWithdrawals = depositERC20WithdrawalAmounts.reduce(
        reducerFunc,
      );

      // convert wei amount
      const depositERC20WithdrawalsTotal = totalDepositTokenWithdrawals;

      const depositWithdrawalsFinalDetails = [
        { depositERC20TokenSymbol, depositERC20WithdrawalsTotal },
      ];

      setDepositWithdrawalsDetails(depositWithdrawalsFinalDetails);
    }
  };

  // get events where member made a withdrawal from the syndicate
  // this way, we can tell which token was withdrawn
  const getMemberDistributionsWithdrawalEvents = async () => {
    // Managers do not deposit into a syndicate they manage.
    if (syndicateAddress === account) return "-";

    const memberDistributionsWithdrawalEvents = await DistributionLogicContract.getDistributionEvents(
      "DistributionClaimed",
      {
        syndicateAddress: web3.utils.toChecksumAddress(syndicateAddress),
        memberAddress: account,
      },
    );

    if (memberDistributionsWithdrawalEvents.length) {
      const distributionsWithdrawalDetails = [];
      for (let j = 0; j < memberDistributionsWithdrawalEvents.length; j++) {
        const {
          distributionERC20Address,
          amount,
        } = memberDistributionsWithdrawalEvents[j].returnValues;

        distributionsWithdrawalDetails.push({
          distributionERC20Address,
          amount,
        });
      }

      // get unique tokens
      const tokenAddresses = distributionsWithdrawalDetails.map(
        ({ distributionERC20Address }) => distributionERC20Address,
      );

      const uniqueDistributionERC20s = tokenAddresses.filter(onlyUnique);
      // get total withdrawal amount for each unique token
      const distributionWithdrawalsFinalDetails = [];
      for (let i = 0; i < uniqueDistributionERC20s.length; i++) {
        // track total withdrawals per token
        let totalWithdrawalAmount = 0;

        const { decimals, symbol } = await getCoinFromContractAddress(
          uniqueDistributionERC20s[i],
        );

        // token properties
        const distributionERC20Symbol = symbol
          ? symbol
          : formatAddress(uniqueDistributionERC20s[i], 3, 3);
        const distributionERC20Decimals = decimals ? decimals : "18";

        for (let j = 0; j < distributionsWithdrawalDetails.length; j++) {
          const {
            distributionERC20Address,
            amount,
          } = distributionsWithdrawalDetails[j];
          if (distributionERC20Address === uniqueDistributionERC20s[i]) {
            const withdrawnAmount = getWeiAmount(
              amount,
              distributionERC20Decimals,
              false,
            );
            totalWithdrawalAmount += +withdrawnAmount;
          }
        }
        distributionWithdrawalsFinalDetails.push({
          distributionERC20Symbol,
          totalWithdrawalAmount,
        });
      }

      setDistributionsWithdrawalDetails(distributionWithdrawalsFinalDetails);
    }
  };

  // set tooltip text to show deposit details
  const withdrawalstooltipText = (
    <div className="relative bg-gray-9 p-4 rounded-custom">
      {depositWithdrawalsDetails.length ? (
        <div>
          <p className="text-sm mb-2">Deposit Withdrawals:</p>
          <table className="table-fixed w-full">
            <thead className="mb-2">
              <tr className="mb-4 text-sm">
                <th className="font-bold text-gray-dim">
                  <b>Token</b>
                </th>
                <th className="font-bold text-gray-dim">
                  <b>Withdrawal Amount</b>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-90">
              {depositWithdrawalsDetails.map(
                (depositWithdrawalDetail, index) => {
                  const {
                    depositERC20TokenSymbol,
                    depositERC20WithdrawalsTotal,
                  } = depositWithdrawalDetail;

                  return (
                    <tr className="font-whyte-light" key={index}>
                      <td className="font-whyte-light relative py-2 text-xs">
                        {depositERC20TokenSymbol}
                      </td>
                      <td className="font-whyte-light relative py-2 text-xs">
                        {floatedNumberWithCommas(depositERC20WithdrawalsTotal)}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      {distributionsWithdrawalDetails.length ? (
        <div className="mt-2">
          <p className="text-sm mb-2">Distributions Withdrawals:</p>
          <table className="table-fixed w-full">
            <thead className="mb-2">
              <tr className="mb-4 text-sm">
                <th className="font-bold text-gray-dim">
                  <b>Token</b>
                </th>
                <th className="font-bold text-gray-dim">
                  <b>Withdrawal Amount</b>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-90">
              {distributionsWithdrawalDetails.map(
                (distributionWithdrawalDetail, index) => {
                  const {
                    distributionERC20Symbol,
                    totalWithdrawalAmount,
                  } = distributionWithdrawalDetail;

                  return (
                    <tr className="font-whyte-light" key={index}>
                      <td className="font-whyte-light relative py-2 text-xs">
                        {distributionERC20Symbol}
                      </td>
                      <td className="font-whyte-light relative py-2 text-xs">
                        {floatedNumberWithCommas(totalWithdrawalAmount)}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );

  // count of actions
  const count =
    depositWithdrawalsDetails.length + distributionsWithdrawalDetails.length;

  return (
    <div className="flex flex-row items-center w-full visibility-container">
      <div className="w-full visibility-container">
        <div className="relative w-full tooltip">
          <div>{syndicateAddress === account ? "-" : count}</div>

          {depositWithdrawalsDetails.length ||
          distributionsWithdrawalDetails.length ? (
            <div
              className={`tooltiptext invisible visibility-hover absolute ${
                count.toString().length === 1 ? `-left-2` : `-left-1`
              } w-full`}
            >
              {withdrawalstooltipText}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GetClaimedDistributions;
