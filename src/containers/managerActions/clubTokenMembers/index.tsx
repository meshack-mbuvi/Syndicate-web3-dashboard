import CopyLink from "@/components/shared/CopyLink";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { useIsClubOwner } from "@/hooks/useClubOwner";
import { AppState } from "@/state";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MemberAddressComponent } from "./memberAddress";
import MembersTable from "./MembersTable";
import GenerateDepositLink from "../GenerateDepositLink";
import { setDepositReadyInfo } from "@/state/legalInfo";
import { useRouter } from "next/router";
import { generateMemberSignURL } from "@/utils/generateMemberSignURL";
import useClubTokenMembers from "@/hooks/useClubTokenMembers";
import { animated } from "react-spring";

const ClubTokenMembers = (): JSX.Element => {
  // retrieve state variables
  const {
    clubMembersSliceReducer: { clubMembers, loadingClubMembers },
    erc20TokenSliceReducer: {
      erc20Token: { symbol },
      depositDetails: { depositTokenSymbol, ethDepositToken },
    },
    legalInfoReducer: {
      depositReadyInfo: { adminSigned },
      walletSignature: { signature },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const isOwner = useIsClubOwner();
  const router = useRouter();
  const { clubAddress } = router.query;

  const [filteredAddress, setFilteredAddress] = useState("");

  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState(false);
  const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false);
  const [linkShareAgreementChecked, setLinkShareAgreementChecked] =
    useState(false);

  const setClubDepositLink = (clubDepositLink: string) => {
    dispatch(
      setDepositReadyInfo({ adminSigned, depositLink: clubDepositLink }),
    );
  };

  // fetch club members
  useClubTokenMembers();

  // club deposit link
  useEffect(() => {
    const legal = JSON.parse(localStorage.getItem("legal") || "{}");
    const clubLegalData = legal[clubAddress as string];
    if (!clubLegalData?.signaturesNeeded) {
      return setClubDepositLink(
        `${window.location.origin}/clubs/${clubAddress}`,
      );
    }
    if (
      clubLegalData?.clubData.adminSignature &&
      clubLegalData.signaturesNeeded
    ) {
      const memberSignURL = generateMemberSignURL(
        clubAddress as string,
        clubLegalData.clubData,
        clubLegalData.clubData.adminSignature,
      );
      setClubDepositLink(memberSignURL);
    }
  }, [clubAddress, signature, showGenerateLinkModal]);

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
          return <MemberAddressComponent {...row} />;
        },
      },
      {
        Header: `Deposit amount`,
        accessor: function depositAmount({
          depositAmount,
          depositSymbol = depositTokenSymbol,
        }) {
          return (
            <p className="flex text-white text-base my-1 leading-6">
              {`${floatedNumberWithCommas(
                depositAmount,
                ethDepositToken ?? false,
              )} ${depositSymbol}`}
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

  const membersTabInstruction = isOwner
    ? "Invite members by sharing your club's deposit link.\
                    They’ll show up here once they deposit."
    : "Members will show up here once they deposit funds into this club.";

  return (
    <div className="w-full rounded-md h-full max-w-1480">
      <div className="w-full px-2 sm:px-0 col-span-12 overflow-x-scroll no-scroll-bar sm:overflow-x-auto -mr-6 sm:mr-auto">
        {loadingClubMembers ? (
          <>
            <div className="mb-8 mt-10">
              <SkeletonLoader width="36" height="6" borderRadius="rounded-md" />
            </div>
            <>
              {[...Array(4).keys()].map((_, index) => {
                return (
                  <div
                    className="grid grid-cols-12 gap-5 border-b-1 border-gray-syn6 py-3"
                    key={index}
                  >
                    <div className="flex justify-start space-x-4 items-center w-full col-span-3">
                      <div className="flex-shrink-0">
                        <SkeletonLoader
                          width="8"
                          height="8"
                          borderRadius="rounded-full"
                        />
                      </div>
                      <SkeletonLoader
                        width="36"
                        height="6"
                        borderRadius="rounded-md"
                      />
                    </div>
                    {[...Array(2).keys()].map((_, index) => {
                      return (
                        <div
                          className="w-full flex items-center col-span-3"
                          key={index}
                        >
                          <SkeletonLoader
                            width="36"
                            height="6"
                            borderRadius="rounded-md"
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          </>
        ) : tableData.length || filteredAddress ? (
          <div className="w-max sm:w-auto">
            <MembersTable
              columns={columns}
              data={tableData}
              filterAddressOnChangeHandler={filterAddressOnChangeHandler}
              searchAddress={filteredAddress}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="my-24.5">
              <div className="flex flex-col space-y-4 text-center">
                <p className="text-xl ">This club has no members yet.</p>

                <div className="space-y-8 flex flex-col items-center">
                  <p className="text-gray-syn4 text-base">
                    {membersTabInstruction}
                  </p>
                  {isOwner && (
                    <div className="flex justify-center flex-col sm:w-104">
                      {!adminSigned && (
                        <div className="flex space-between mb-6">
                          <input
                            className="bg-transparent rounded mt-1 focus:ring-offset-0 cursor-pointer"
                            onChange={() =>
                              setLinkShareAgreementChecked(
                                !linkShareAgreementChecked,
                              )
                            }
                            type="checkbox"
                            id="linkShareAgreement"
                            name="linkShareAgreement"
                          />
                          <animated.p className="text-sm text-gray-syn4 ml-3 text-left">
                            I agree to only share this link privately. I
                            understand that publicly sharing this link may
                            violate securities laws. <br></br>
                            <a
                              target="_blank"
                              style={{ color: "#4376ff" }}
                              href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html"
                              rel="noopener noreferrer"
                            >
                              Learn more.
                            </a>{" "}
                          </animated.p>
                        </div>
                      )}
                      <GenerateDepositLink
                        showGenerateLinkModal={showGenerateLinkModal}
                        setShowGenerateLinkModal={setShowGenerateLinkModal}
                        updateDepositLinkCopyState={updateDepositLinkCopyState}
                        showDepositLinkCopyState={showDepositLinkCopyState}
                        agreementChecked={linkShareAgreementChecked}
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
