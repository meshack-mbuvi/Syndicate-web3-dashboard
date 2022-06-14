import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { CtaButton } from '@/components/CTAButton';
import { DistributionsDisclaimerModal } from '@/components/distributions/disclaimerModal';
import { DistributionMembersTable } from '@/components/distributions/membersTable';
import { ClubHeader } from '@/components/syndicates/shared/clubHeader';
import { setERC20Token } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import useClubTokenMembers from '@/hooks/useClubTokenMembers';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { setClubMembers } from '@/state/clubMembers';
import { setDistributionMembers } from '@/state/distributions';
import {
  setERC20TokenContract,
  setERC20TokenDetails
} from '@/state/erc20token/slice';
import { Status } from '@/state/wallet/types';
import { isZeroAddress } from '@/utils';
import { mockActiveERC20Token } from '@/utils/mockdata';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DistributionHeader from '../DistributionHeader';

const ReviewDistribution: React.FC = () => {
  const {
    web3Reducer: {
      web3: { status, account, web3, activeNetwork }
    },
    initializeContractsReducer: { syndicateContracts },
    erc20TokenSliceReducer: {
      erc20Token: { name, symbol, owner, address }
    },
    assetsSliceReducer: { loading },
    distributeTokensReducer: { distributionTokens },
    clubMembersSliceReducer: { clubMembers, loadingClubMembers }
  } = useSelector((state: AppState) => state);

  const [activeAddresses, setActiveAddresses] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const isDemoMode = useDemoMode();
  const {
    query: { clubAddress }
  } = useRouter();

  const { loadingClubDeposits, totalDeposits } =
    useClubDepositsAndSupply(address);

  // fetch club members
  useClubTokenMembers();

  /**
   * Fetch club details
   */
  useEffect(() => {
    if (!clubAddress || status == Status.CONNECTING) return;

    if (
      !isZeroAddress(clubAddress as string) &&
      web3.utils.isAddress(clubAddress as string) &&
      syndicateContracts?.DepositTokenMintModule
    ) {
      const clubERC20tokenContract = new ClubERC20Contract(
        clubAddress as string,
        web3,
        activeNetwork
      );

      dispatch(setERC20TokenContract(clubERC20tokenContract));

      dispatch(setERC20Token(clubERC20tokenContract));

      return () => {
        dispatch(setClubMembers([]));
      };
    } else if (isDemoMode) {
      // using "Active" as the default view.
      dispatch(setERC20TokenDetails(mockActiveERC20Token));
    }
  }, [
    clubAddress,
    account,
    status,
    syndicateContracts?.DepositTokenMintModule
  ]);

  useEffect(() => {
    if (loadingClubMembers) return;

    const distributionMembers = memberDetails.filter((_, index) =>
      activeAddresses.includes(index)
    );

    dispatch(setDistributionMembers(distributionMembers));
  }, [activeAddresses, isEditing]);

  /**
   * Get addresses of all club members
   */
  useEffect(() => {
    const activeAddresses = [];
    clubMembers.forEach((member) => activeAddresses.push(member.memberAddress));
    setActiveAddresses(activeAddresses);
  }, [JSON.stringify(clubMembers)]);

  // prepare member data here
  useEffect(() => {
    if (clubMembers.length && distributionTokens.length) {
      const memberDetails = clubMembers.map(
        ({ ownershipShare, clubTokens, memberAddress }) => {
          return {
            ownershipShare,
            memberName: memberAddress,
            clubTokenHolding: clubTokens,
            distributionShare: ownershipShare * 100,
            receivingTokens: distributionTokens.map(
              ({ tokenAmount, symbol, logo, icon }) => {
                return {
                  amount: ownershipShare * +tokenAmount,
                  tokenSymbol: symbol,
                  tokenIcon: logo || icon || '/images/token-gray.svg'
                };
              }
            )
          };
        }
      );

      setMemberDetails(memberDetails);
    } else {
      setMemberDetails([]);
    }

    return () => {
      setMemberDetails([]);
    };
  }, [
    loadingClubDeposits,
    loadingClubMembers,
    JSON.stringify(clubMembers),
    JSON.stringify(distributionTokens)
  ]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const toggleEditDistribution = () => {
    setIsEditing(!isEditing);
  };

  const clearSearchValue = (e) => {
    e.preventDefault();
    setSearchValue('');
  };

  const [activeMembersBeforeEditing, setActiveMembersBeforeEditing] =
    useState(activeAddresses);

  useEffect(() => {
    if (isEditing) {
      // save current active indices to state
      setActiveMembersBeforeEditing(activeAddresses);
    }
  }, [isEditing]);

  const handleSaveAction = (e) => {
    e.preventDefault();
    toggleEditDistribution();
  };

  /**
   * This function reverts activeAddresses to the state before editing
   */
  const handleCancelAction = (e) => {
    e.preventDefault();

    // restore active indices from state
    setActiveAddresses(activeMembersBeforeEditing);
    toggleEditDistribution();
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleDisclaimerConfirmation = (e?) => {
    e.preventDefault();
    setIsModalVisible(false);
  };

  const showDistributeDisclaimer = (e) => {
    e.preventDefault();
    setIsModalVisible(true);
  };

  // check whether there is any new change during editing.
  const activeMembersChanged =
    JSON.stringify(activeAddresses) !==
    JSON.stringify(activeMembersBeforeEditing);

  return (
    <div className="container mx-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <ClubHeader
          {...{
            loading,
            name,
            symbol,
            owner,
            loadingClubDeposits,
            totalDeposits,
            managerSettingsOpen: false,
            clubAddress: address
          }}
        />
      </div>

      <div className="flex mt-16 justify-between">
        <DistributionHeader
          titleText={isEditing ? 'Edit Distribution' : 'Review Distribution'}
          subTitleText={`Members will automatically receive the asset distributions below, once the transaction is completed on-chain.`}
        />

        {isEditing ? (
          <div className="flex space-x-8">
            <PrimaryButton
              customClasses="border-none font-Slussen"
              textColor="text-blue"
              onClick={handleCancelAction}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              customClasses={`border-none font-Slussen ${
                activeMembersChanged ? 'bg-white' : 'bg-gray-syn7'
              } px-8 py-4`}
              textColor={`${
                activeMembersChanged ? 'text-black' : 'text-white'
              }`}
              onClick={handleSaveAction}
            >
              Save
            </PrimaryButton>
          </div>
        ) : (
          <CtaButton
            greenCta={true}
            fullWidth={false}
            onClick={showDistributeDisclaimer}
          >
            Submit
          </CtaButton>
        )}
      </div>

      <DistributionMembersTable
        activeAddresses={activeAddresses}
        membersDetails={memberDetails}
        tokens={distributionTokens}
        isEditing={isEditing}
        searchValue={searchValue}
        handleIsEditingChange={toggleEditDistribution}
        handleActiveAddressesChange={setActiveAddresses}
        handleSearchChange={handleSearchChange}
        clearSearchValue={clearSearchValue}
      />

      <DistributionsDisclaimerModal
        {...{
          isModalVisible,
          handleModalClose,
          onClick: handleDisclaimerConfirmation
        }}
      />
    </div>
  );
};

export default ReviewDistribution;
