import { getTotalDistributions } from "@/helpers";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ifRows } from "./interfaces";
import { getEvents } from "@/helpers/retrieveEvents";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
import { getWeiAmount, onlyUnique } from "src/utils/conversions";
import { TokenMappings } from "src/utils/tokenMappings";
import { formatAddress } from "@/utils/formatAddress";
import { InfoIcon } from "src/components/iconWrappers";
import { floatedNumberWithCommas } from "src/utils/numberWithCommas";

const GetDistributions = ({ row: { syndicateAddress } }: ifRows) => {
  const { web3: web3Wrapper } = useSelector(
    (state: RootState) => state.web3Reducer
  );
  const { syndicateContractInstance } = useSelector(
    (state: RootState) => state.syndicateInstanceReducer
  );

  const { account, web3 } = web3Wrapper;

  const [distributionDetails, setDistributionDetails] = useState<any>([]);
  const [distributionToolTip, setDistributionToolTip] = useState<
    string | React.ReactNode
  >("");

  /* Get total number of distributions set on the current syndicate
   * We'll get unique token distributions set and present the count.
   * Hovering over the count value will reveal individual tokens along with their
   * distribution amounts.
   */
  const distributionTokens = [];
  const distributionTokenDetails = [];
  const getDistributionEvents = async () => {
    const distributionEvents = await getEvents(
      syndicateContractInstance,
      "managerSetterDistribution",
      { syndicateAddress: web3.utils.toChecksumAddress(syndicateAddress) }
    );
    if (distributionEvents.length) {
      for (let i = 0; i < distributionEvents.length; i++) {
        const { distributionERC20Address } = distributionEvents[i].returnValues;
        distributionTokens.push(distributionERC20Address);
      }
    }

    const uniqueDistributionERC20s = distributionTokens.filter(onlyUnique);
    for (let j = 0; j < uniqueDistributionERC20s.length; j++) {
      // token decimals
      const ERC20Details = new ERC20TokenDetails(uniqueDistributionERC20s[j]);
      const tokenDecimals = await ERC20Details.getTokenDecimals();
      const distributionERC20Decimals = tokenDecimals ? tokenDecimals : "18";

      // token symbol
      const mappedTokenAddress = Object.keys(TokenMappings).find(
        (key) =>
          web3.utils.toChecksumAddress(key) ===
          web3.utils.toChecksumAddress(uniqueDistributionERC20s[j])
      );

      let distributionERC20Symbol = formatAddress(
        uniqueDistributionERC20s[j],
        4,
        4
      );
      if (mappedTokenAddress) {
        distributionERC20Symbol = TokenMappings[mappedTokenAddress];
      }

      // get distribution amount for token
      const tokenDistributedAmount = await getTotalDistributions(
        syndicateContractInstance,
        syndicateAddress,
        uniqueDistributionERC20s[j]
      ).then((distributions) => {
        return getWeiAmount(distributions, distributionERC20Decimals, false);
      });

      // update tokens array
      distributionTokenDetails.push({
        distributionERC20Symbol,
        tokenDistributedAmount,
      });
    }
    setDistributionDetails(distributionTokenDetails);
    // set tooltip text
    const tooltipText = (
      <div className="relative bg-gray-9 p-4 rounded-custom">
        <table className="table-fixed w-full">
          <thead className="mb-2">
            <tr className="mb-4 text-sm">
              <th className="font-bold text-gray-dim">
                <b>Token</b>
              </th>
              <th className="font-bold text-gray-dim">
                <b>Distribution Amount</b>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-90">
            {distributionTokenDetails.map((distributionDetail, index) => {
              const {
                distributionERC20Symbol,
                tokenDistributedAmount,
              } = distributionDetail;

              return (
                <tr className="font-whyte-light" key={index}>
                  <td className="font-whyte-light relative py-2 text-xs">
                    {distributionERC20Symbol}
                  </td>
                  <td className="font-whyte-light relative py-2 text-xs">
                    {floatedNumberWithCommas(tokenDistributedAmount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );

    setDistributionToolTip(tooltipText);
  };

  useEffect(() => {
    getDistributionEvents();
  }, [syndicateAddress, account]);

  // count of distributions

  return (
    <div className="flex flex-row items-center w-full visibility-container">
      <div className="w-full visibility-container">
        <div className="relative w-full tooltip">
          <div>{distributionDetails.length}</div>
          {distributionDetails.length ? (
            <div
              className={`tooltiptext invisible visibility-hover absolute ${
                distributionDetails.length.toString().length === 1 ? `-left-2` : `-left-1`
              } w-full`}
            >
              {distributionToolTip}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GetDistributions;
