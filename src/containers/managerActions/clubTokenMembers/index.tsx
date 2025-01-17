import { SkeletonLoader } from '@/components/skeletonLoader';
import { MintAndShareTokens } from '@/containers/managerActions/mintAndShareTokens';
import AddMemberModal from '@/containers/managerActions/mintAndShareTokens/AddMemberModal';
import NavToClubSettingsModal from '@/containers/managerActions/mintAndShareTokens/NavToClubSettingsModal';
import useClubTokenMembers from '@/hooks/clubs/useClubTokenMembers';
import { clubMember } from '@/hooks/clubs/utils/types';
import useModal from '@/hooks/useModal';
import { AppState } from '@/state';
import { setDepositReadyInfo } from '@/state/legalInfo';
import { setMemberToUpdate } from '@/state/modifyCapTable/slice';
import { SelectedMember } from '@/state/modifyCapTable/types';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { generateMemberSignURL } from '@/utils/generateMemberSignURL';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { animated } from 'react-spring';
import { Column } from 'react-table';
import GenerateDepositLink from '../GenerateDepositLink';
import ModifyCapTable from '../modifyMemberAllocation';
import { MemberAddressComponent } from './memberAddress';
import MembersTable from './MembersTable';
import MoreOptions from './moreOptions';

const ClubTokenMembers: FC<{ isOwner: boolean }> = ({
  isOwner
}): JSX.Element => {
  // retrieve state variables
  const {
    erc20TokenSliceReducer: {
      depositDetails: { depositTokenSymbol, nativeDepositToken },
      erc20Token: { depositsEnabled }
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
  const router = useRouter();
  const {
    query: { clubAddress }
  } = router;

  const [searchValue, setSearchValue] = useState('');

  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState(false);
  const [showGenerateLinkModal, setShowGenerateLinkModal] = useState(false);
  const [linkShareAgreementChecked, setLinkShareAgreementChecked] =
    useState(false);
  const [showAddMemberModal, toggleAddMemberModal] = useModal();
  const [showMintTokensModal, toggleMintTokensModal] = useState(false);
  const [showMintNavToClubSettings, setShowMintNavToClubSettings] =
    useState(false);

  // fetch club members
  const { clubMembers, isFetchingMembers } = useClubTokenMembers();

  const setClubDepositLink = (clubDepositLink: string): void => {
    dispatch(
      setDepositReadyInfo({ adminSigned, depositLink: clubDepositLink })
    );
  };

  // club deposit link
  useEffect(() => {
    const legal = JSON.parse(localStorage.getItem('legal') || '{}');
    const clubLegalData = legal[clubAddress as string];
    if (!clubLegalData?.signaturesNeeded) {
      return setClubDepositLink(
        `${window.location.origin}/clubs/${clubAddress}?chain=${activeNetwork.network}`
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
        activeNetwork.network
      );
      setClubDepositLink(memberSignURL);
    }
  }, [clubAddress, signature, showGenerateLinkModal]);

  const updateDepositLinkCopyState = (): void => {
    setShowDepositLinkCopyState(true);
    setTimeout(() => setShowDepositLinkCopyState(false), 1000);
  };

  const searchValueOnChangeHandler = (event: {
    preventDefault: () => void;
    target: { value: string };
  }): void => {
    event.preventDefault();
    const { value } = event.target;
    setSearchValue(value.trim());
  };

  const [syndicateMembersToShow, setSynMembersToShow] = useState(clubMembers);
  const [showMemberOptions, setShowMemberOptions] = useState({
    show: false,
    memberAddress: ''
  });
  const [tableData, setTableData] = useState<clubMember[]>([]);

  const generateTableData = (): void => {
    const allMembers = [...clubMembers];

    if (searchValue.trim()) {
      // search any text
      const filteredMembers = allMembers.filter(
        (member) =>
          member.memberAddress
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          member.ensName.toLowerCase().includes(searchValue.toLowerCase())
      );

      setSynMembersToShow(filteredMembers);
    } else {
      setSynMembersToShow(allMembers);
    }
  };

  useEffect(() => {
    generateTableData();
  }, [JSON.stringify(clubMembers), searchValue]);

  useEffect(() => {
    setTableData(syndicateMembersToShow);
  }, [JSON.stringify(syndicateMembersToShow), JSON.stringify(clubMembers)]);

  const [selectedMember, setSelectedMember] = useState<
    | {
        [x: string]: string;
      }
    | undefined
  >();
  const [showModifyCapTable, setShowModifyCapTable] = useModal();
  const moreOptionItems: ReactNode = (
    <div className="space-x-2 flex">
      <p className="flex my-auto">
        <Image src="/images/edit.svg" alt="" height={16} width={16} />
      </p>
      <p className="font-whyte text-base leading-6">
        Modify club token allocation
      </p>
    </div>
  );

  const handleMenuItemClick = (member: SelectedMember): void => {
    dispatch(setMemberToUpdate(member));
    setShowModifyCapTable();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Member',
        accessor: function memberAddress(row: {
          memberAddress: string;
        }): JSX.Element {
          return (
            <MemberAddressComponent
              {...row}
              setSelectedMember={(): void => setSelectedMember(row)}
            />
          );
        }
      },
      {
        Header: `Deposit amount`,
        accessor: function depositAmount({
          depositAmount,
          depositSymbol = depositTokenSymbol
        }: {
          [x: string]: string;
        }): JSX.Element {
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
        }: {
          [x: string]: string;
        }): JSX.Element {
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
        accessor: function distributionShare(
          club: SelectedMember
        ): JSX.Element {
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
          return <></>;
        }
      }
    ],
    [clubMembers, showMemberOptions, isOwner]
  ) as Column<clubMember>[];

  const membersTabInstruction = isOwner
    ? "Invite members by sharing your club's deposit link.\
                    They’ll show up here once they deposit."
    : 'Members will show up here once they deposit funds into this club.';

  return (
    <div className="w-full rounded-md h-full max-w-1480">
      <div className="w-full px-2 sm:px-0 col-span-12 overflow-x-scroll no-scroll-bar sm:overflow-x-auto -mr-6 sm:mr-auto">
        {isFetchingMembers ? (
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
        ) : tableData.length || searchValue ? (
          <div className="w-max sm:w-auto mb-12">
            <MembersTable
              isOwner={isOwner}
              columns={columns}
              data={tableData}
              searchValueOnChangeHandler={searchValueOnChangeHandler}
              searchValue={searchValue}
              selectedMember={selectedMember}
              setSelectedMember={(): void => setSelectedMember(undefined)}
              toggleAddMemberModal={toggleAddMemberModal}
              setShowMemberOptions={setShowMemberOptions}
              setShowMintNavToClubSettings={setShowMintNavToClubSettings}
            />

            {depositsEnabled && (
              <ModifyCapTable
                showModifyCapTable={showModifyCapTable}
                setShowModifyCapTable={setShowModifyCapTable}
              />
            )}
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
                        <button
                          className="flex space-between mb-6"
                          onClick={(): void =>
                            setLinkShareAgreementChecked(
                              !linkShareAgreementChecked
                            )
                          }
                        >
                          <input
                            className="bg-transparent rounded mt-1 focus:ring-offset-0 cursor-pointer"
                            onChange={(): void =>
                              setLinkShareAgreementChecked(
                                !linkShareAgreementChecked
                              )
                            }
                            type="checkbox"
                            id="linkShareAgreement"
                            checked={linkShareAgreementChecked}
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
                        </button>
                      )}
                      <GenerateDepositLink
                        showGenerateLinkModal={showGenerateLinkModal}
                        setShowGenerateLinkModal={setShowGenerateLinkModal}
                        updateDepositLinkCopyState={updateDepositLinkCopyState}
                        showDepositLinkCopyState={showDepositLinkCopyState}
                        agreementChecked={linkShareAgreementChecked}
                      />
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
                            Add a member to this club without requiring them to
                            deposit first. You can also mint club tokens to
                            them.
                          </p>
                        </div>

                        <button
                          className="bg-white rounded-custom w-full flex items-center justify-center py-4 px-8"
                          onClick={(): void => {
                            if (depositsEnabled) {
                              toggleMintTokensModal(true);
                            } else {
                              setShowMintNavToClubSettings(true);
                            }
                          }}
                        >
                          <p className="text-black whitespace-nowrap text-base font-whyte font-bold">
                            Add member manually
                          </p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddMemberModal
        showModal={showAddMemberModal}
        closeModal={(): void => toggleAddMemberModal()}
        mintTokens={toggleMintTokensModal}
      />

      <NavToClubSettingsModal
        {...{
          showMintNavToClubSettings,
          setShowMintNavToClubSettings
        }}
      />

      <MintAndShareTokens
        {...{
          show: showMintTokensModal,
          handleShow: toggleMintTokensModal,
          closeAddMemberModal: toggleAddMemberModal,
          existingMembers: tableData
        }}
      />
    </div>
  );
};

export default ClubTokenMembers;
