import React from "react";
import { flatMap, sum } from "lodash";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";

interface Props {
  memberWithdrawalDetails: Record<string, any>;
  token: Record<string, any>;
}

const DistributionTokenCard = (props: Props): JSX.Element => {
  const { memberWithdrawalDetails, token } = props;

  const getTotalMemberDistributions = (tokenSymbol) => {
    return sum(
      flatMap(memberWithdrawalDetails, (item) => {
        return parseFloat(
          // return 0 if value is undefined
          item[tokenSymbol]?.memberDistributionsWithdrawalsToDate ?? "0",
        );
      }),
    );
  };

  const getPercentageWithdrawn = (tokenSymbol, totalDistributions) => {
    const tokenSum = getTotalMemberDistributions(tokenSymbol);
    return (tokenSum / parseFloat(totalDistributions)) * 100;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center">
        <img
          src={token?.tokenIcon}
          width={20}
          height={20}
          alt={token?.tokenSymbol}
        />
        <span className="ml-2">
          {floatedNumberWithCommas(
            (token?.tokenDistributions as string).split(".")?.[0],
          )}
        </span>
        <span className="text-gray-lightManatee">
          .{(token?.tokenDistributions as string).split(".")?.[1]}
        </span>
        <span className="text-gray-lightManatee">
          &nbsp;{token?.tokenSymbol}
        </span>
      </div>
      <div className="text-gray-lightManatee">
        {/* Get total of the member distributions */}
        {getPercentageWithdrawn(
          token.tokenSymbol,
          token.tokenDistributions,
        ).toFixed(2)}
        % withdrawn
      </div>
    </div>
  );
};

export default DistributionTokenCard;
