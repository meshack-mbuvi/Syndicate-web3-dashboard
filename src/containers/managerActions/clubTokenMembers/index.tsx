import { SkeletonLoader } from '@/components/skeletonLoader';
import { MintAndShareTokens } from '@/containers/managerActions/mintAndShareTokens';
import AddMemberModal from '@/containers/managerActions/mintAndShareTokens/AddMemberModal';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import useClubTokenMembers from '@/hooks/useClubTokenMembers';
import useModal from '@/hooks/useModal';
import { AppState } from '@/state';
import { setDepositReadyInfo } from '@/state/legalInfo';
import { setMemberToUpdate } from '@/state/modifyCapTable/slice';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { generateMemberSignURL } from '@/utils/generateMemberSignURL';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated } from 'react-spring';
import GenerateDepositLink from '../GenerateDepositLink';
import ModifyCapTable from '../modifyMemberAllocation';
import { MemberAddressComponent } from './memberAddress';
import MembersTable from './MembersTable';
import MoreOptions from './moreOptions';

const ClubTokenMembers = (): JSX.Element => {
  // retrieve state variables
  const {
    clubMembersSliceReducer: { clubMembers, loadingClubMembers },
    erc20TokenSliceReducer: {
      depositDetails: { depositTokenSymbol, nativeDepositToken }
    },
    legalInfoReducer: {
      depositReadyInfo: { adminSigned },
      walletSignature: { signature }
    },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const isOwner = useIsClubOwner();
  const router = useRouter();
  const { clubAddress } = router.query;

  const [filteredAddress, setFilteredAddress] = useState('');

  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState(false);
  const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false);
  const [linkShareAgreementChecked, setLinkShareAgreementChecked] =
    useState(false);
  const [showAddMemberModal, toggleAddMemberModal] = useModal();
  const [showMintTokensModal, toggleMintTokensModal] = useState(false);

  const setClubDepositLink = (clubDepositLink: string) => {
    dispatch(
      setDepositReadyInfo({ adminSigned, depositLink: clubDepositLink })
    );
  };

  // fetch club members
  useClubTokenMembers();

  // club deposit link
  useEffect(() => {
    const legal = JSON.parse(localStorage.getItem('legal') || '{}');
    const clubLegalData = legal[clubAddress as string];
    if (!clubLegalData?.signaturesNeeded) {
      return setClubDepositLink(
        `${window.location.origin}/clubs/${clubAddress}?network=${activeNetwork.chainId}`
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
        activeNetwork.chainId
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
  const [showMemberOptions, setShowMemberOptions] = useState({
    show: false,
    memberAddress: ''
  });
  const [tableData, setTableData] = useState([]);

  const generateTableData = () => {
    const allMembers = [...clubMembers];

    if (filteredAddress.trim()) {
      // search any text
      const filteredMembers = allMembers.filter((member) =>
        member.memberAddress
          .toLowerCase()
          .includes(filteredAddress.toLowerCase())
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

  const [selectedMember, setSelectedMember] = useState<any>();
  const [showModifyCapTable, setShowModifyCapTable] = useModal();
  const moreOptionItems = (
    <div className="space-x-2 flex">
      <p className="flex my-auto">
        <Image src="/images/edit.svg" alt="" height={16} width={16} />
      </p>
      <p className="font-whyte text-base leading-6">
        Modify club token allocation
      </p>
    </div>
  );

  const handleMenuItemClick = (member) => {
    dispatch(setMemberToUpdate(member));
    setShowModifyCapTable();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Member',
        accessor: function memberAddress(row: { memberAddress: string }) {
          return (
            <MemberAddressComponent
              {...row}
              setSelectedMember={() => setSelectedMember(row)}
            />
          );
        }
      },
      {
        Header: `Deposit amount`,
        accessor: function depositAmount({
          depositAmount,
          depositSymbol = depositTokenSymbol
        }) {
          return (
            <p className="flex text-white text-base leading-6">
              {`${floatedNumberWithCommas(
                depositAmount,
                nativeDepositToken ?? false
              )} ${depositSymbol}`}
            </p>
          );
        }
      },
      {
        Header: `Club tokens (ownership share)`,
        accessor: function distributionShare({
          ownershipShare,
          clubTokens,
          symbol
        }) {
          return (
            <p>
              {`${floatedNumberWithCommas(clubTokens)} ${symbol}`}
              <span className="ml-1 text-gray-syn4">
                {`(${floatedNumberWithCommas(ownershipShare)}%)`}
              </span>
            </p>
          );
        }
      },
      {
        Header: ` `,
        accessor: function distributionShare(club) {
          // Only show this option for club owners.
          // and only on hover
          const { memberAddress } = club;
          if (
            isOwner &&
            showMemberOptions.show &&
            showMemberOptions.memberAddress === memberAddress
          ) {
            return (
              <div className="text-base leading-6 flex justify-end py-1 w-full">
                <MoreOptions
                  {...{
                    club,
                    moreOptionItems,
                    handleMenuItemClick: () => handleMenuItemClick(club)
                  }}
                />
              </div>
            );
          }
        }
      }
    ],
    [clubMembers, showMemberOptions, isOwner]
  );

  const membersTabInstruction = isOwner
    ? "Invite members by sharing your club's deposit link.\
                    They’ll show up here once they deposit."
    : 'Members will show up here once they deposit funds into this club.';

  //TODO: Remove this to re-enable cap table
  const capTableEnabled = false;

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
              selectedMember={selectedMember}
              setSelectedMember={() => setSelectedMember(undefined)}
              toggleAddMemberModal={toggleAddMemberModal}
              setShowMemberOptions={setShowMemberOptions}
            />
            {capTableEnabled ? (
              <ModifyCapTable
                showModifyCapTable={showModifyCapTable}
                setShowModifyCapTable={setShowModifyCapTable}
              />
            ) : null}
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
                                !linkShareAgreementChecked
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
                              style={{ color: '#4376ff' }}
                              href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html"
                              rel="noopener noreferrer"
                            >
                              Learn more.
                            </a>{' '}
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

                      {capTableEnabled ? (
                        <div className="space-y-2 mt-4">
                          <div className="py-3 flex text-gray-syn4 items-center">
                            <div className="border-b-1 w-1/2 border-gray-syn6 mr-1"></div>
                            <p className="text-gray-syn4 text-sm">or</p>
                            <div className="border-b-1 w-1/2 border-gray-syn6 ml-1"></div>
                          </div>
                          <div>
                            <p className="text-base leading-4 text-white pb-2">
                              Manually add member
                            </p>
                            <p className="text-sm text-gray-syn4 pb-2 leading-5 mt-2">
                              Add a member to this club without requiring them
                              to deposit first. You can also mint club tokens to
                              them.
                            </p>
                          </div>

                          <button
                            className="bg-white rounded-custom w-full flex items-center justify-center py-4 px-8"
                            onClick={() => {
                              toggleMintTokensModal(true);
                            }}
                          >
                            <p className="text-black whitespace-nowrap text-base font-whyte font-bold">
                              Add member manually
                            </p>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {capTableEnabled ? (
        <>
          <AddMemberModal
            showModal={showAddMemberModal}
            closeModal={() => toggleAddMemberModal()}
            mintTokens={toggleMintTokensModal}
          />

          <MintAndShareTokens
            {...{
              show: showMintTokensModal,
              handleShow: toggleMintTokensModal,
              closeAddMemberModal: toggleAddMemberModal,
              existingMembers: tableData
            }}
          />
        </>
      ) : null}
    </div>
  );
};

export default ClubTokenMembers;
