import React, { useEffect, useState } from 'react';
import { ArrowNarrowRightIcon, ExternalLinkIcon } from '@heroicons/react/solid';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import ProcessingClaimModal from './processingClaimModal';

const NFTCard: React.FC<{
  collectible: any;
  handeleSelectedCollectibleId: any;
  collectibleSelected: boolean;
  handleClaimedCollectible: any;
  claiming: boolean;
  claimed: boolean;
}> = ({
  collectible,
  handeleSelectedCollectibleId,
  collectibleSelected,
  handleClaimedCollectible,
  claiming,
  claimed
}) => {
  const {
    web3Reducer: {
      web3: { account }
    },
    utilityNFTSliceReducer: { utilityNFT },
    initializeContractsReducer: { syndicateContracts }
  } = useSelector((state: AppState) => state);

  const [hoverState, setHoverState] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [claimFailed, setClaimFailed] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successfulClaim, setSuccessfulClaim] = useState<boolean>(false);
  const [showProcessingClaimModal, setShowProcessingClaimModal] =
    useState<boolean>(false);

  const { RugUtilityMintModule } = syndicateContracts;

  useEffect(() => {
    setSubmitting(claiming);
  }, [claiming]);

  const onTxConfirm = () => {
    setSubmitting(true);
  };

  const onTxReceipt = async () => {
    setSubmitting(false);
    setSuccessfulClaim(true);
    handleClaimedCollectible(collectible.token_id);
  };

  const onTxFail = () => {
    setSubmitting(false);
    setSuccessfulClaim(false);
    setClaimFailed(true);
  };

  const handleSelectClick = (e) => {
    e.preventDefault();
    handeleSelectedCollectibleId(parseInt(collectible.token_id));
  };

  const claimNFT = async () => {
    setSubmitting(true);
    setShowProcessingClaimModal(true);
    try {
      await RugUtilityMintModule.redeem(
        account,
        collectible.token_id,
        utilityNFT.nativePrice,
        onTxConfirm,
        onTxReceipt,
        onTxFail,
        setTransactionHash
      );
      setTransactionHash(transactionHash);
    } catch (error) {
      setSuccessfulClaim(false);
      setClaimFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      key={collectible.token_id}
      className="rounded-1.5lg border-1 border-gray-syn6 relative"
      onMouseOver={() => {
        setHoverState(true);
      }}
      onFocus={() => {
        setHoverState(true);
      }}
      onMouseLeave={() => {
        setHoverState(false);
      }}
    >
      {claimed || successfulClaim ? (
        <div className="absolute w-full top-4 px-4">
          <div className="px-3 py-2 bg-white bg-opacity-30 rounded-4xl flex justify-between align-middle items-center">
            <span>Claimed with mint pass #{collectible.token_id}</span>{' '}
            <ExternalLinkIcon className="w-5 h-5 text-white inline"></ExternalLinkIcon>
          </div>
        </div>
      ) : hoverState || collectibleSelected ? (
        <button
          onClick={handleSelectClick}
          className={`absolute px-3 py-2 bg-white bg-opacity-30 rounded-4xl top-4 left-4  cursor pointer flex items-center space-x-2`}
        >
          <input
            type="checkbox"
            className="bg-transparent rounded focus:ring-offset-0 border-white ring-white h-4 w-4"
            checked={collectibleSelected}
            style={{ pointerEvents: 'none' }}
            readOnly
          />{' '}
          <span>{collectibleSelected ? 'Selected' : 'Select'}</span>
        </button>
      ) : null}

      <div
        style={{
          backgroundColor: '#232529',
          backgroundImage: `url('${
            collectible.image
              ? collectible.image
              : 'https://gateway.pinata.cloud/ipfs/Qma5cZH8yBaSYtqAYW5TUbGdm4YrfZ1YXQUnNeFeYVKjsB'
          }')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center'
        }}
        className="rounded-t-1.5lg h-88 w-88 bg-gray-syn6"
      ></div>
      <div className="py-6 px-8 w-88">
        {!hoverState || claimed || successfulClaim ? (
          <div>
            <div className="h3 mb-2">RugRadio Genesis</div>
            <div className="flex align-middle items-center text-gray-syn4 text-right">
              from mint pass #{collectible.token_id}
            </div>
            {/* <div className="flex align-middle items-center justify-center text-gray-syn4">
              <span className="mr-2">
                <img
                  src={"/images/token-gray-4.svg"}
                  width="16"
                  height="16"
                  alt=""
                />
              </span>
              {claimed
                ? "Generating 1,000 RUG per week"
                : "Generates 1,000 RUG per week"}
            </div> */}
          </div>
        ) : !claimed && !successfulClaim ? (
          <div>
            <button
              className={`w-full rounded-lg text-base text-black px-8 py-4 font-medium ${
                !submitting
                  ? 'bg-green'
                  : 'bg-gray-syn7 text-white cursor-default'
              } align-baseline`}
              onClick={!submitting ? claimNFT : null}
              disabled={submitting}
            >
              {!submitting ? 'Claim with mint pass #' : 'Claiming with pass #'}
              {collectible.token_id}{' '}
              {!submitting ? (
                <ArrowNarrowRightIcon className="w-6 h-6 text-black inline" />
              ) : null}
            </button>
          </div>
        ) : null}
      </div>

      <ProcessingClaimModal
        showModal={showProcessingClaimModal}
        closeModal={() => {
          setShowProcessingClaimModal(false);
        }}
        successfulClaim={successfulClaim}
        transactionHash={transactionHash}
        claimFailed={claimFailed}
        submitting={submitting || claiming}
      ></ProcessingClaimModal>
    </div>
  );
};

export default NFTCard;
