import { useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Callout, CalloutType } from '@/components/callout';
import EditIcon from '@/components/icons/editIcon';
import EstimateGas from '@/components/EstimateGas';
import { M1 } from '@/components/typography';
import { CopyToClipboardIcon } from '@/components/iconWrappers';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { useRouter } from 'next/router';
import { EditRowIndex } from '@/state/modifyCollectiveSettings/types';
import { ContractMapper } from '@/hooks/useGasDetails';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { useCreateState } from '@/hooks/collectives/useCreateCollective';

export const SubmitContent: React.FC<{
  isSubmitDisabled?: boolean;
  showCallout?: boolean;
  handleEdit: () => void;
  cancelEdit: () => void;
}> = ({
  handleEdit,
  cancelEdit,
  isSubmitDisabled = false,
  showCallout = false
}) => {
  const heightTransition = isSubmitDisabled ? 'max-h-0' : 'max-h-2screen';
  const opacityTransition = isSubmitDisabled ? 'opacity-0' : 'opacity-100';

  const {
    modifyCollectiveSettingsReducer: {
      activeRow,
      settings: { isTransferable, mintPrice, mintEndTime, maxPerWallet }
    },
    modifyClubSettingsReducer: { maxNumberOfMembers, maxAmountRaising },
    erc20TokenSliceReducer: {
      erc20Token: { endTime },
      activeModuleDetails: {
        activeMintModuleReqs: { requiredTokens, requiredTokenBalances }
      }
    }
  } = useSelector((state: AppState) => state);

  const { openUntil } = useCreateState();

  const router = useRouter();
  const { collectiveAddress, clubAddress } = router.query;

  const activeContract = useMemo(() => {
    switch (activeRow) {
      case EditRowIndex.MintPrice:
        return ContractMapper.EthPriceMintModule;
      case EditRowIndex.ImageDescriptionGroup:
        return ContractMapper.FixedRenderer;
      case EditRowIndex.MaxPerWallet:
        return ContractMapper.MaxPerMemberERC721;
      case EditRowIndex.OpenUntil:
        if (openUntil === OpenUntil.FUTURE_DATE) {
          return ContractMapper.TimeRequirements;
        } else {
          return ContractMapper.MaxTotalSupplyERC721;
        }
      case EditRowIndex.Transfer:
        return ContractMapper.ERC721Collective;

      /* Club Setting */
      case EditRowIndex.TotalSupply:
        return ContractMapper.MaxTotalSupplyMixin;
      case EditRowIndex.TokenGate:
        return ContractMapper.TokenGatedMixin;
      case EditRowIndex.MaxMembers:
        return ContractMapper.MaxMemberCountMixin;
      case EditRowIndex.Time:
        return ContractMapper.TimeRequirements;
      case EditRowIndex.CloseTimeWindow:
        return ContractMapper.TimeRequirements;

      default:
        return null;
    }
  }, [activeRow]);

  return (
    <div
      className={`w-full space-y-6 pb-8 bg-black bg-opacity-100 sm:bg-opacity-0 sm:p-0 sm:pb-0 ${
        isSubmitDisabled ? 'mt-0' : 'mt-6'
      }`}
    >
      <div className="space-y-6 flex flex-col">
        {/* Gas fees */}
        <div
          className={`flex-grow space-y-6 transition-all duration-700 ${heightTransition} ${opacityTransition}`}
        >
          {showCallout && (
            <Callout type={CalloutType.WARNING} showIcon={false}>
              This change will impact the NFTs that have already been claimed.
            </Callout>
          )}

          <Callout extraClasses="rounded-xl p-4">
            <EstimateGas
              // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'ContractMapper'
              contract={activeContract}
              args={{
                /* Collective Settings */
                collectiveAddress,
                mintPrice,
                metadataCid:
                  'bafkreich7a3peetvllpl7fefehzxmoizlb7qv774ln2vqtibcs764myqga', // Easter egg metadata for gas estimation
                collectiveMintEndTime: mintEndTime,
                maxPerWallet,
                isTransferable,

                /* Club Settings */
                clubAddress,
                maxNumberOfMembers,
                totalSupply: maxAmountRaising,
                logicOperator: 1,
                tokens: requiredTokens,
                balances: requiredTokenBalances,
                clubMintEndTime: endTime
              }}
              customClasses="bg-opacity-20 rounded-custom w-full flex cursor-default items-center"
            />
          </Callout>
        </div>

        {/* Submit button */}
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <button
            onClick={cancelEdit}
            className="text-gray-syn4 bg-transparent py-4"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitDisabled}
            onClick={handleEdit}
            className={`${
              isSubmitDisabled ? 'primary-CTA-disabled' : 'primary-CTA'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditButton: React.FC<{ handleClick: () => void }> = ({
  handleClick
}) => {
  return (
    <button
      className="flex self-start opacity-100 sm:opacity-0 cursor-pointer sm:group-hover:opacity-100 text-blue-navy transition-opacity duration-200"
      onClick={handleClick}
    >
      <span className="flex space-x-2 items-center">
        <EditIcon />
        <span>Edit</span>
      </span>
    </button>
  );
};

export const CopyText: React.FC<{ txt: string }> = ({ txt }) => {
  const [showCopyState, setShowCopyState] = useState(false);

  const updateAddressCopyState = () => {
    setShowCopyState(true);
    setTimeout(() => setShowCopyState(false), 1000);
  };

  return (
    <div className="flex space-x-2">
      <M1>{txt}</M1>
      <CopyToClipboard text={txt} onCopy={updateAddressCopyState}>
        <div className="relative cursor-pointer flex items-center">
          {showCopyState && (
            <span className="absolute text-xs top-5 -left-1/2">copied</span>
          )}
          <CopyToClipboardIcon color="text-gray-syn5 hover:text-gray-syn4" />
        </div>
      </CopyToClipboard>
    </div>
  );
};
