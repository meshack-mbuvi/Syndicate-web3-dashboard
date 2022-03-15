import { SearchForm } from "@/components/inputs/searchForm";
import { LinkButton, LinkType } from "@/components/linkButtons";
import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { SET_MEMBER_SIGN_STATUS } from "@/graphql/mutations";
import { MEMBER_SIGNED_QUERY } from "@/graphql/queries";
import { useIsClubOwner } from "@/hooks/useClubOwner";
import { useDemoMode } from "@/hooks/useDemoMode";
import { AppState } from "@/state";
import { formatAddress } from "@/utils/formatAddress";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { useMutation, useQuery } from "@apollo/client";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePagination, useTable } from "react-table";
import { NotSignedIcon } from "../shared/notSignedIcon";
import { SignedIcon } from "../shared/signedIcon";
import SignerMenu from "./signerMenu";

const MembersTable = ({
  columns,
  data,
  filterAddressOnChangeHandler,
  searchAddress,
  selectedMember,
  setSelectedMember,
  toggleAddMemberModal,
  setShowMemberOptions,
}): JSX.Element => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: { symbol },
      depositDetails: { depositTokenSymbol },
    },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: AppState) => state);

  const isOwner = useIsClubOwner();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageSize, pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 10,
      },
    },
    usePagination,
  );
  const [showMemberDetailsModal, setShowMemberDetailsModal] = useState(false);

  const {
    query: { clubAddress },
  } = useRouter();

  const [memberInfo, setMemberInfo] = useState<{
    "Wallet address": string;
    "Deposit amount": string;
    "Club tokens": string;
    "Ownership share": string;
  }>();

  useEffect(() => {
    if (selectedMember) {
      const { clubTokens, depositAmount, memberAddress, ownershipShare } =
        selectedMember;

      setMemberInfo({
        "Wallet address": memberAddress,
        "Deposit amount": `${floatedNumberWithCommas(
          depositAmount,
        )} ${depositTokenSymbol}`,
        "Club tokens": `${floatedNumberWithCommas(clubTokens)} ${symbol}`,
        "Ownership share": `${floatedNumberWithCommas(ownershipShare)}%`,
      });
      setShowMemberDetailsModal(true);
    }
  }, [selectedMember]);

  const menuItems = [
    {
      menuText: "Signed",
      menuIcon: <SignedIcon fillColor="#FFFFFF" />,
    },
    {
      menuText: "Not signed",
      menuIcon: <NotSignedIcon />,
    },
  ];

  // show first and last page for pagination
  const firstPage = pageIndex === 0 ? "1" : pageIndex * pageSize;
  let lastPage;
  if (pageIndex > 0) {
    lastPage =
      page.length < pageSize
        ? pageIndex * pageSize + page.length
        : (pageIndex + 1) * pageSize;
  } else if (pageIndex === 0) {
    lastPage =
      page.length < pageSize
        ? (pageIndex + 1) * pageSize + page.length
        : (pageIndex + 1) * pageSize;
  }

  const memberAddress = memberInfo?.["Wallet address"];

  const [setMemberHasSigned, { loading }] = useMutation(
    SET_MEMBER_SIGN_STATUS,
    { context: { clientName: "backend" } },
  );

  const {
    loading: memberDocSignLoading,
    data: memberSignedData,
    refetch: refetchMemberStatus,
  } = useQuery(MEMBER_SIGNED_QUERY, {
    variables: {
      clubAddress,
      address: memberAddress,
    },
    skip: !clubAddress || !memberAddress,
    context: { clientName: "backend" },
  });

  useEffect(() => {
    if (clubAddress && memberAddress) {
      refetchMemberStatus();
    }
  }, [clubAddress, memberAddress, loading]);

  const isDemoMode = useDemoMode();

  const handleClick = (memberData) => {
    const { clubTokens, depositAmount, memberAddress, ownershipShare } =
      memberData;

    setMemberInfo({
      "Wallet address": memberAddress,
      "Deposit amount": `${floatedNumberWithCommas(
        depositAmount,
      )} ${depositTokenSymbol}`,
      "Club tokens": `${floatedNumberWithCommas(clubTokens)} ${symbol}`,
      "Ownership share": `${floatedNumberWithCommas(ownershipShare)}%`,
    });
    setShowMemberDetailsModal(true);
  };

  const closeMemberDetailsModal = () => {
    setShowMemberDetailsModal(false);
    setSelectedMember(undefined);
  };

  const handleSetSelected = async (index: number) => {
    const hasSigned = menuItems[index].menuText === "Signed";

    setMemberHasSigned({
      variables: { clubAddress, address: memberAddress, hasSigned },
    });
  };

  const hasMemberSigned = memberSignedData?.Financial_memberSigned;

  //TODO: remove this to re-enable cap table.
  const capTableEnabled = false

  return (
    <div className="overflow-y-hidden ">
      <div className="flex my-11 col-span-12 space-x-8 justify-between items-center">
        {page.length > 1 || searchAddress ? (
          <SearchForm
            {...{
              onChangeHandler: filterAddressOnChangeHandler,
              searchValue: searchAddress,
              itemsCount: data.length,
            }}
          />
        ) : (
          <div></div>
        )}

        {isOwner && capTableEnabled && (
          <div className="inline-flex items-right">
            <LinkButton
              type={LinkType.MEMBER}
              onClick={() => {
                toggleAddMemberModal();
              }}
            />
          </div>
        )}
      </div>

      <table
        {...getTableProps()}
        className={`w-full ${
          page.length ? "border-b-1" : "border-b-0"
        } border-gray-syn6`}
      >
        <thead className="w-full">
          {page.length
            ? headerGroups.map((headerGroup, index) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={index}
                  className="text-gray-syn4 text-sm grid grid-cols-12 gap-5 leading-6"
                >
                  {headerGroup.headers.map((column, index) => {
                    return (
                      <th
                        {...column.getHeaderProps()}
                        key={index}
                        className="flex align-middle rounded-md col-span-3 text-left text-sm font-whyte-light text-gray-syn4"
                      >
                        {column.render("Header")}
                      </th>
                    );
                  })}
                </tr>
              ))
            : null}
        </thead>

        <tbody
          className="w-full divide-y divide-gray-syn6 overflow-y-scroll"
          {...getTableBodyProps()}
        >
          {page.map((row: any, index) => {
            prepareRow(row);

            return (
              <tr
                {...row.getRowProps()}
                key={index}
                className={`w-full text-base grid grid-cols-12 gap-5 cursor-pointer border-gray-syn6 text-left`}
                onClick={() => {
                  handleClick(row.original);
                }}
                onMouseEnter={() =>
                  isOwner && capTableEnabled
                    ? setShowMemberOptions({
                        show: true,
                        memberAddress: row.original.memberAddress,
                      })
                    : null
                }
                onMouseLeave={() =>
                  isOwner && capTableEnabled
                    ? setShowMemberOptions({
                        show: false,
                        memberAddress: "",
                      })
                    : null
                }
              >
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={cellIndex}
                      className={`m-0 col-span-3 text-base py-4 text-white flex items-center`}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {searchAddress && !page.length && (
            <div className="flex flex-col justify-center w-full h-full items-center">
              <ExclamationCircleIcon className="h-10 w-10 mb-2 text-gray-lightManatee" />
              <p className="text-gray-lightManatee">No member found.</p>
            </div>
          )}
        </tbody>
      </table>

      {/* show pagination only when we have more than 10 members */}
      {data.length > 10 ? (
        <div className="flex w-full text-white space-x-4 justify-center my-8 leading-6">
          <button
            className={`pt-1 ${
              !canPreviousPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <Image
              src={"/images/arrowBack.svg"}
              height="16"
              width="16"
              alt="Previous"
            />
          </button>
          <p className="">
            {firstPage} - {lastPage}
            {` of `} {data.length}
          </p>

          <button
            className={`pt-1 ${
              !canNextPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <Image
              src={"/images/arrowNext.svg"}
              height="16"
              width="16"
              alt="Next"
            />
          </button>
        </div>
      ) : (
        ""
      )}

      {account || isDemoMode ? (
        <Modal
          {...{
            show: showMemberDetailsModal,
            modalStyle: ModalStyle.DARK,
            showCloseButton: false,
            customWidth: "w-730",
            outsideOnClick: true,
            closeModal: closeMemberDetailsModal,
            customClassName: "py-8",
            showHeader: false,
            overflowYScroll: false,
            overflowXScroll: false,
            overflow: "overflow-visible",
          }}
        >
          <div className="relative">
            <div className="flex space-x-6 align-center w-full mb-4 px-10 pb-4">
              <Image
                width="64"
                height="64"
                src={"/images/user.svg"}
                alt="user"
              />
              <div className="flex flex-grow space-x-4">
                <p className="text-2xl my-auto align-middle">
                  {formatAddress(memberInfo?.["Wallet address"], 6, 4)}
                </p>
                {hasMemberSigned == true && (
                  <span className="my-auto">
                    <SignedIcon />
                  </span>
                )}
              </div>
            </div>
            <div className="border-b-1 border-gray-24 absolute w-full"></div>
            <div className="px-10 pt-4">
              <div className="hidden sm:block">
                <div className="mt-4 text-base">
                  {memberInfo &&
                    Object.entries(memberInfo).map(([key, value], index) => (
                      <div
                        className="py-4 flex justify-between border-b-1 border-gray-24"
                        key={index}
                      >
                        <div className="text-gray-syn4 pr-4">{key}</div>
                        <div className="overflow-y-scroll  no-scroll-bar">
                          {value}
                        </div>
                      </div>
                    ))}

                  <div className="py-4 flex justify-between border-b-1 border-gray-24">
                    <div className="text-gray-syn4 pr-4">Legal agreements</div>
                    {isOwner ? (
                      <div className="no-scroll-bar">
                        {memberDocSignLoading || loading ? (
                          <Spinner width="w-5" height="h-5" margin="mr-4" />
                        ) : (
                          <SignerMenu
                            titleIndex={hasMemberSigned ? 0 : 1}
                            setSelectedIndex={handleSetSelected}
                            menuItems={menuItems}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          {hasMemberSigned
                            ? menuItems[0].menuIcon
                            : menuItems[1].menuIcon}
                        </div>
                        <span>
                          {hasMemberSigned
                            ? menuItems[0].menuText
                            : menuItems[1].menuText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default MembersTable;
