import CopyLink from "@/components/shared/CopyLink";
import { SkeletonLoader } from "@/components/skeletonLoader";
import useClubTokenMembers from "@/hooks/useClubTokenMembers";
import { AppState } from "@/state";
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SyndicateMembersTable from "./SyndicateMembersTable";

const ClubTokenMembers = (): JSX.Element => {
  // retrieve state variables
  const {
    clubMembersSliceReducer: { clubMembers },
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: AppState) => state);

  const [filteredAddress, setFilteredAddress] = useState("");

  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState(false);
  const [clubDepositLink, setClubDepositLink] = useState("");

  // club deposit link
  useEffect(() => {
    setClubDepositLink(
      `${window.location.origin}/clubs/${erc20Token?.address}/`,
    );
  }, [erc20Token.address]);

  const updateDepositLinkCopyState = () => {
    setShowDepositLinkCopyState(true);
    setTimeout(() => setShowDepositLinkCopyState(false), 1000);
  };

  const filterAddressOnChangeHandler = (event: {
    preventDefault: () => void;
    target: { value: any };
  }) => {
    event.preventDefault();
    const { value } = event.target;
    setFilteredAddress(value.trim());
  };
  const { loading } = useClubTokenMembers();

  const [syndicateMembersToShow, setSynMembersToShow] = useState(clubMembers);

  const [tableData, setTableData] = useState([]);

  const generateTableData = () => {
    const allMembers = [...clubMembers];

    if (filteredAddress.trim()) {
      // search any text
      const filteredMembers = allMembers.filter((member) =>
        member.memberAddress
          .toLowerCase()
          .includes(filteredAddress.toLowerCase()),
      );
      setSynMembersToShow(filteredMembers);
    } else {
      setSynMembersToShow(allMembers);
    }
  };

  useEffect(() => {
    generateTableData();
  }, [JSON.stringify(clubMembers), filteredAddress]);

  useEffect(() => {
    setTableData(syndicateMembersToShow);
  }, [JSON.stringify(syndicateMembersToShow)]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Member",
        accessor: function memberAddress(row: { memberAddress: string }) {
          const { memberAddress } = row;

          return (
            <div className="flex space-x-3 align-center text-base leading-6">
              <Image
                width="32"
                height="32"
                src={"/images/user.svg"}
                alt="user"
              />
              <p className="my-1">{formatAddress(memberAddress, 6, 6)}</p>
            </div>
          );
        },
      },
      {
        Header: `Deposit amount`,
        accessor: function depositAmount({
          depositAmount,
          depositSymbol = "USDC",
        }) {
          return (
            <p className="flex text-white text-base my-1 leading-6">
              {`${floatedNumberWithCommas(depositAmount)} ${depositSymbol}`}
            </p>
          );
        },
      },
      {
        Header: `Club tokens (ownership share)`,
        accessor: function distributionShare({
          ownershipShare,
          clubTokens,
          symbol,
        }) {
          return (
            <p className="my-1">
              {`${floatedNumberWithCommas(clubTokens)} ${symbol}`}
              <span className="ml-1 text-gray-syn4">
                {`(${floatedNumberWithCommas(ownershipShare)}%)`}
              </span>
            </p>
          );
        },
      },
    ],
    [clubMembers],
  );

  return (
    <div className="w-full rounded-md h-full max-w-1480">
      <div className="w-full px-2 sm:px-0 col-span-12">
        {loading ? (
          <div className="space-y-6 my-11">
            <div className="flex space-x-3">
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
            </div>
            <div className="flex space-x-3">
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
              <SkeletonLoader
                width="full"
                height="8"
                borderRadius="rounded-md"
              />
            </div>
          </div>
        ) : tableData.length || filteredAddress ? (
          <SyndicateMembersTable
            columns={columns}
            data={tableData}
            filterAddressOnChangeHandler={filterAddressOnChangeHandler}
            searchAddress={filteredAddress}
          />
        ) : (
          <div className="flex justify-center">
            <div className="my-24.5">
              <div className="flex flex-col space-y-4 text-center">
                <p className="text-xl ">This club has no members yet.</p>

                <div className="space-y-8 flex flex-col items-center">
                  <p className="text-gray-syn4 text-base">
                    Invite members by sharing your club&apos;s deposit link.
                    They’ll show up here once they deposit.
                  </p>
                  {erc20Token.isOwner && (
                    <div
                      style={{ width: "416px" }}
                      className="flex justify-center"
                    >
                      <CopyLink
                        link={clubDepositLink}
                        updateCopyState={updateDepositLinkCopyState}
                        showCopiedState={showDepositLinkCopyState}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubTokenMembers;
