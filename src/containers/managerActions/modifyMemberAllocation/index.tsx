import { OldClubERC20Contract } from '@/ClubERC20Factory/clubERC20/oldClubERC20';
import { OwnerMintModuleContract } from '@/ClubERC20Factory/ownerMintModule';
import { ProgressModal, ProgressModalState } from '@/components/progressModal';
import ConfirmMemberAllocations from '@/containers/managerActions/modifyMemberAllocation/ConfirmMemberAllocations';
import ModifyMemberClubTokens from '@/containers/managerActions/modifyMemberAllocation/ModifyMemberClubTokens';
import { setERC20Token } from '@/helpers/erc20TokenDetails';
import { useClubDepositsAndSupply } from '@/hooks/useClubDepositsAndSupply';
import useModal from '@/hooks/useModal';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { isDev } from '@/utils/environment';
import { formatAddress } from '@/utils/formatAddress';
import {
  floatedNumberWithCommas,
  numberInputRemoveCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CONTRACT_ADDRESSES } from '@/Networks';

const ModifyClubTokens: React.FC<{
  showModifyCapTable;
  setShowModifyCapTable;
}> = (props) => {
  const { showModifyCapTable, setShowModifyCapTable } = props;
  const dispatch = useDispatch();

  const {
    clubMembersSliceReducer: { clubMembers },
    erc20TokenSliceReducer: {
      erc20Token: { symbol, tokenDecimals, maxTotalSupply, address },
      erc20TokenContract
    },
    modifyCapTableSlice: { memberToUpdate },
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    initializeContractsReducer: { syndicateContracts }
  } = useSelector((state: AppState) => state);

  const { totalSupply } = useClubDepositsAndSupply(address);
  const [preview, setPreview] = useModal();
  const [confirm, setConfirm] = useState(false);
  const [updatingCapTable, setUpdatingCapTable] = useState(false);
  const [updated, setUpdated] = useModal();
  const [updateFailed, setUpdateFailed] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [userRejectedUpdate, setUserRejectedUpdate] = useState(false);
  const [newTotalSupply, setNewTotalSupply] = useState(totalSupply);
  const [member, setMember] = useState(memberToUpdate.memberAddress);
  const [newOwnership, setNewOwnership] = useState(0);
  const [mintClubTokens, setMintClubTokens] = useState(false);
  const [tokensToMintOrBurn, setTokensToMintOrBurn] = useState(0);
  const [memberAllocation, setMemberAllocation] = useState('');
  const [memberAllocationError, setMemberAllocationError] = useState<
    string | React.ReactElement
  >('');
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);
  const currentClubTokenSupply = +maxTotalSupply - +totalSupply;

  // pre-populate member address and token amount fields
  // with selected member values.
  useEffect(() => {
    if (showModifyCapTable) {
      setMember(memberToUpdate.memberAddress);
    }
  }, [memberToUpdate.memberAddress, showModifyCapTable]);

  useEffect(() => {
    if (showModifyCapTable && !memberAllocation) {
      setMemberAllocation(memberToUpdate.clubTokens);
    } else {
      setMemberAllocation(memberAllocation);
    }
  }, [memberToUpdate.clubTokens, showModifyCapTable]);

  // disable the continue button on load since we pre-populate
  // the member allocation field with the current member tokens
  useEffect(() => {
    if (+memberToUpdate.clubTokens === +memberAllocation) {
      setContinueButtonDisabled(true);
    } else {
      setContinueButtonDisabled(false);
    }
  }, [memberToUpdate.clubTokens, memberAllocation]);

  /**
   * Calculate new ownership and new total supply
   */
  useEffect(() => {
    if (!tokensToMintOrBurn || !memberAllocation) return;
    let newTokenSupply;
    if (tokensToMintOrBurn && !mintClubTokens) {
      newTokenSupply = +totalSupply - +tokensToMintOrBurn;
    } else if (tokensToMintOrBurn && mintClubTokens) {
      newTokenSupply = +totalSupply + +tokensToMintOrBurn;
    }

    setNewTotalSupply(newTokenSupply);

    const ownership = (+memberAllocation * 100) / newTokenSupply;
    setNewOwnership(ownership);
  }, [memberAllocation, totalSupply, tokensToMintOrBurn, mintClubTokens]);

  /**
   * Determine whether to mint or burn tokens for given member address
   * When new allocation is greater than current allocation, we mint more tokens
   * Otherwise we burn excess tokens
   */
  useEffect(() => {
    if (+memberAllocation > +memberToUpdate.clubTokens) {
      // mint more tokens
      setMintClubTokens(true);
      setTokensToMintOrBurn(
        parseInt(memberAllocation || '0', 10) - +memberToUpdate.clubTokens
      );
    } else if (+memberAllocation < +memberToUpdate.clubTokens) {
      // burn excess tokens
      setMintClubTokens(false);
      setTokensToMintOrBurn(
        +memberToUpdate.clubTokens - parseInt(memberAllocation || '0', 10)
      );
    }
  }, [memberAllocation, memberToUpdate]);

  const handleSubmit = () => {
    setPreview();
    setShowModifyCapTable(false);
  };

  const refreshClubDetails = () => dispatch(setERC20Token(erc20TokenContract));

  const handleCloseSuccessModal = () => {
    setUpdatingCapTable(false);
    setConfirm(false);
    setUpdateFailed(false);
    if (updated) {
      setUpdated();
    }

    refreshClubDetails();
  };

  const onTxConfirm = () => {
    setConfirm(false);
    setUpdatingCapTable(true);
  };

  const onTxReceipt = () => {
    setUpdatingCapTable(false);
    setUpdated();
    refreshClubDetails();
  };

  const onTxFail = (error) => {
    setUpdateFailed(true);
    setUpdatingCapTable(false);
    setConfirm(false);

    const { code } = error;
    if (code == 4001) {
      setUserRejectedUpdate(true);
    } else {
      setUserRejectedUpdate(false);
    }
  };

  /**
   * This method updates cap table by either minting or burning tokens to/from
   * the selected wallet address
   */
  const handleUpdatingCapTable = async () => {
    setConfirm(true);
    setPreview();

    // OwnerMintModule for policyMintERC20
    const OWNER_MINT_MODULE =
      CONTRACT_ADDRESSES[activeNetwork.chainId]?.OwnerMintModule;
    // OwnerMintModule for mintPolicy
    const OWNER_MINT_MODULE_2 = process.env.NEXT_PUBLIC_OWNER_MINT_MODULE_2;

    const policyMintERC20MintModule =
      await syndicateContracts.policyMintERC20.isModuleAllowed(
        erc20TokenContract.address,
        OWNER_MINT_MODULE
      );

    // Both ETH and USDC clubs should work with OwnerMintModule
    const useOwnerMintModule =
      policyMintERC20MintModule ||
      (await syndicateContracts.mintPolicy.isModuleAllowed(
        erc20TokenContract.address,
        OWNER_MINT_MODULE_2
      ));

    try {
      /**
       * At this point, we either burn or mint tokens for the selected wallet address
       */
      if (mintClubTokens) {
        if (useOwnerMintModule) {
          // Use either OwnerMintModule for policyMintERC20 or one for mintPolicy
          // respectively
          const OwnerMintModule = policyMintERC20MintModule
            ? syndicateContracts.OwnerMintModule
            : new OwnerMintModuleContract(
                OWNER_MINT_MODULE_2,
                web3,
                activeNetwork
              );

          await OwnerMintModule.ownerMint(
            getWeiAmount(
              web3,
              tokensToMintOrBurn.toString(),
              tokenDecimals,
              true
            ),
            erc20TokenContract.address,
            memberToUpdate.memberAddress,
            account,
            onTxConfirm,
            onTxReceipt,
            onTxFail,
            setTransactionHash
          );
        } else {
          if (isDev) {
            await erc20TokenContract.mintTo(
              memberToUpdate.memberAddress,
              getWeiAmount(
                web3,
                tokensToMintOrBurn.toString(),
                tokenDecimals,
                true
              ),
              account,
              onTxConfirm,
              onTxReceipt,
              onTxFail,
              setTransactionHash
            );
          } else {
            const oldErc20TokenContract = new OldClubERC20Contract(
              erc20TokenContract.address,
              web3,
              activeNetwork
            );

            await oldErc20TokenContract.controllerMint(
              memberToUpdate.memberAddress,
              getWeiAmount(
                web3,
                tokensToMintOrBurn.toString(),
                tokenDecimals,
                true
              ),
              account,
              onTxConfirm,
              onTxReceipt,
              onTxFail,
              setTransactionHash
            );
          }
        }
      } else {
        await erc20TokenContract.controllerRedeem(
          memberToUpdate.memberAddress,
          getWeiAmount(
            web3,
            tokensToMintOrBurn.toString(),
            tokenDecimals,
            true
          ),
          account,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash
        );
      }
    } catch (error) {
      console.log({ error });
      onTxFail(error);
    }
  };

  const handleAmountChange = (e) => {
    const amount = numberInputRemoveCommas(e);

    // calculate available tokens supply since we override the
    // current member club tokens and not add onto it.
    let availableTokenSupply = 0;
    if (clubMembers.length === 1) {
      availableTokenSupply = maxTotalSupply;
    } else if (clubMembers.length > 1) {
      const otherClubMembersTokens =
        +maxTotalSupply -
        (+memberToUpdate.clubTokens + +currentClubTokenSupply);
      availableTokenSupply = +maxTotalSupply - +otherClubMembersTokens;
    }

    if (amount < 0 || !amount) {
      setMemberAllocationError('Amount is required.');
      setContinueButtonDisabled(true);
    } else if (
      +amount > +availableTokenSupply &&
      +amount > +memberToUpdate.clubTokens
    ) {
      if (+currentClubTokenSupply === 0) {
        setMemberAllocationError('No available club tokens to mint.');
      } else {
        setMemberAllocationError(
          <span>
            Amount exceeds available club token supply of{' '}
            <button
              onClick={() => {
                setMemberAllocation(
                  clubMembers.length > 1
                    ? availableTokenSupply.toString()
                    : maxTotalSupply.toString()
                );
                setMemberAllocationError('');
              }}
            >
              <u>
                {numberWithCommas(
                  clubMembers.length > 1 ? availableTokenSupply : maxTotalSupply
                )}{' '}
                {symbol}
              </u>
            </button>
          </span>
        );
      }
    } else if (+amount === +memberToUpdate.clubTokens) {
      setContinueButtonDisabled(true);
    } else {
      setMemberAllocationError('');
      setContinueButtonDisabled(false);
    }
    setMemberAllocation(amount >= 0 ? amount : '');
  };

  if (confirm) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Confirm in wallet',
          description:
            'Please confirm the cap table modification from your wallet.',
          state: ProgressModalState.CONFIRM
        }}
      />
    );
  } else if (updatingCapTable) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Updating cap table',
          description:
            'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.',
          transactionHash: transactionHash,
          transactionType: 'transaction',
          state: ProgressModalState.PENDING
        }}
      />
    );
  } else if (updated) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Cap table updated',
          description: `${formatAddress(
            memberToUpdate?.memberAddress,
            6,
            4
          )}'s club token
          allocation has been changed to ${
            floatedNumberWithCommas(memberAllocation) || 0
          } ${symbol}`,
          buttonLabel: 'Done',
          buttonOnClick: handleCloseSuccessModal,
          buttonFullWidth: true,
          state: ProgressModalState.SUCCESS,
          transactionHash: transactionHash,
          transactionType: 'transaction'
        }}
      />
    );
  } else if (updateFailed) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: 'Cap table update failed',
          description: '',
          buttonLabel: 'Close',
          buttonOnClick: handleCloseSuccessModal,
          buttonFullWidth: true,
          state: ProgressModalState.FAILURE,
          transactionHash: userRejectedUpdate ? null : transactionHash,
          transactionType: 'transaction'
        }}
      />
    );
  }

  const clearModalFields = () => {
    setMemberAllocationError('');
    setMember('');
    setMemberAllocation('');
  };

  return (
    <div>
      {/* Modify member allocations modal */}
      <ModifyMemberClubTokens
        {...{
          memberList: clubMembers,
          setShowModifyCapTable,
          showModifyCapTable,
          clearModalFields,
          handleAmountChange,
          memberAllocationError,
          memberAllocation,
          handleSubmit,
          member,
          setMember,
          symbol,
          continueButtonDisabled
        }}
      />

      {/* Confirm new member allocations modal */}
      <ConfirmMemberAllocations
        {...{
          preview,
          setPreview,
          setShowModifyCapTable,
          memberAllocation,
          mintClubTokens,
          newOwnership,
          tokensToMintOrBurn,
          newTotalSupply,
          handleUpdatingCapTable,
          symbol,
          totalSupply,
          memberToUpdate
        }}
      />
    </div>
  );
};

export default ModifyClubTokens;
