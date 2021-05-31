import { formatToMillion, formatToThousands } from "@/utils/numberWithCommas";
import React, { useMemo } from "react";
import ActiveSyndicatesTable from "./ActiveSyndicatesTable";
import GetClaimedDistributions from "./GetClaimedDistributions";
import GetDistributions from "./GetDistributions";
import GetLPDeposits from "./GetLPDeposits";
import GradientAvatar from "./GradientAvatar";
import SyndicateActionButton from "./SyndicateActionButton";

const styles = [
  "lawn-green",
  "pinky-blue",
  "yellowish-light-blue",
  "violet-red",
  "violet-yellow",
];

export const Portfolio = (props: { syndicates }) => {
  const { syndicates } = props;

  const COLUMNS = [
    {
      Header: "Address",
      accessor: "syndicateAddress",
      Cell: ({ value }) => {
        // used useMemo hook to prevent recalculation of style value on every onMouseEnter and onMouseLeave
        const style = useMemo(() => styles.sort(() => 0.5 - Math.random())[0], [
          value,
        ]);
        return (
          <div className="flex flex-row items-center">
            <div className="mr-4">
              <GradientAvatar styles={style} />
            </div>
            <p className="font-whyte-light text-xs">
              {value.slice(0, 5)}...
              {value.slice(value.length - 4, value.length)}
            </p>
          </div>
        );
      },
      showSort: true,
    },
    {
      Header: "Created",
      accessor: "createdDate",
      showSort: true,
    },
    {
      Header: "Status",
      accessor: "active",
      Cell: ({
        row: { openToDeposits, totalDeposits, maxTotalDeposits, closeDate },
        value,
      }) => {
        if (value) {
          if (openToDeposits && totalDeposits < maxTotalDeposits) {
            return `Open until ${closeDate}`;
          } else {
            return "Operating";
          }
        } else {
          return "Inactive";
        }
      },
      showSort: true,
    },
    {
      Header: "Members",
      accessor: "totalLPs",
      Cell: ({ value }) => formatToThousands(value), //`${value / 1000} k`,
      showSort: true,
    },
    {
      Header: "Deposits",
      accessor: function getTotalDeposits(row) {
        // get token symbol
        const { depositERC20TokenSymbol, totalDeposits } = row;
        return `${formatToMillion(totalDeposits)} ${depositERC20TokenSymbol}`;
      },
      showSort: true,
    },
    {
      Header: "Distributions",
      accessor: function getDistributions(row) {
        return <GetDistributions row={row} />;
      },
      showSort: true,
    },
    {
      Header: "My Deposits",
      accessor: function getLPDeposits(row) {
        return <GetLPDeposits row={row} />;
      },
      showSort: true,
    },
    {
      Header: "My Withdrawals",
      accessor: function getClaimedDistributions(row) {
        return <GetClaimedDistributions row={row} />;
      },
      showSort: true,
    },
    {
      Header: "  ",
      accessor: function syndicateActionButtons(row) {
        return <SyndicateActionButton row={row} />;
      },
      showSort: false,
      disableSortBy: true,
    },
  ];

  const columns = useMemo(() => COLUMNS, []);

  return (
    <div className="mt-4 px-4">
      {syndicates && syndicates.length ? (
        <ActiveSyndicatesTable columns={columns} data={syndicates} />
      ) : (
        "No syndicates currently"
      )}
    </div>
  );
};

export default Portfolio;
