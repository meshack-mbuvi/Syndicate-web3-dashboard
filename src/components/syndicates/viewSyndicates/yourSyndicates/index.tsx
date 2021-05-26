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

export const YourSyndicates = (props: { syndicates }) => {
  const { syndicates } = props;

  const COLUMNS = [
    // use of empty spaces to hide table header
    {
      Header: " ",
      accessor: function gradientAvatar() {
        // get random style
        const style = styles.sort(() => 0.5 - Math.random())[0];
        return <GradientAvatar styles={style} />;
      },
      showSort: false,
    },
    {
      Header: "Address",
      accessor: "syndicateAddress",
      Cell: ({ value }) => {
        return `${value.slice(0, 5)}...${value.slice(
          value.length - 4,
          value.length
        )}`;
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
      accessor: "totalDeposits",
      Cell: ({ value }) => `${formatToMillion(value)} DAI`,
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
      showSort: true,
    },
  ];

  const columns = useMemo(() => COLUMNS, []);

  return (
    <div className="mt-4">
      {syndicates && syndicates.length ? (
        <ActiveSyndicatesTable columns={columns} data={syndicates} />
      ) : (
        "No syndicates currently"
      )}
    </div>
  );
};

export default YourSyndicates;
