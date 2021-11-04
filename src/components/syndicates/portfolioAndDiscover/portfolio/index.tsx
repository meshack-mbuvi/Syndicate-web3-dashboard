import { formatNumbers } from "@/utils/formattedNumbers";
import React, { useMemo } from "react";
import ActiveSyndicatesTable from "./ActiveSyndicatesTable";
import GetClaimedDistributions from "./GetClaimedDistributions";
import GetDistributions from "./GetDistributions";
import { GetFormattedDepositsAmount } from "./GetFormattedValue";
import GetMemberDeposits from "./GetMemberDeposits";
import GradientAvatar from "./GradientAvatar";
import SyndicateActionButton from "./SyndicateActionButton";

export const Portfolio = (props: { clubsERC20s }): JSX.Element => {
  const { clubsERC20s } = props;

  const COLUMNS = [
    {
      Header: "Address",
      accessor: "syndicateAddress",
      // eslint-disable-next-line react/display-name
      Cell: ({ value }) => {
        return (
          <div className="flex flex-row items-center">
            <div className="mr-4">
              <GradientAvatar syndicateAddress={value} />
            </div>
            <p>
              {value.slice(0, 5)}...
              {value.slice(value.length - 4, value.length)}
            </p>
          </div>
        );
      },
    },
    {
      Header: "Created",
      accessor: "startTime",
      showSort: true,
    },
    {
      Header: "Status",
      accessor: "status",
      showSort: true,
    },
    {
      Header: "Members",
      accessor: "membersCount",
      Cell: ({ value }) => formatNumbers(value),
      showSort: true,
    },
    {
      Header: "Deposits",
      accessor: function getTotalDeposits(row) {
        return <GetFormattedDepositsAmount row={row} />;
      },
      showSort: true,
    },
    {
      Header: "My Deposits",
      accessor: function getMemberDeposits(row) {
        return <GetMemberDeposits row={row} />;
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
    <div className="mt-0">
      {clubsERC20s && clubsERC20s.length ? (
        <div className="overflow-x-scroll edge-to-edge-with-left-inset lg:mr-auto lg:px-auto lg:w-auto no-scroll-bar">
          <ActiveSyndicatesTable columns={columns} data={clubsERC20s} />
        </div>
      ) : (
        "No syndicates currently"
      )}
    </div>
  );
};

export default Portfolio;
