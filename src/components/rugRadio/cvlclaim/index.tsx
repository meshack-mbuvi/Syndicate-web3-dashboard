import Image from 'next/image';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { CTAButton } from '@/components/CTAButton';
import Layout from '@/components/layout';
import Modal, { ModalStyle } from '@/components/modal';
import { AppState } from '@/state';
import { showWalletModal } from '@/state/wallet/actions';
import { Status } from '@/state/wallet/types';
import { NFTChecker } from './NFTChecker';
import { NFTClaimer } from './NFTClaimer';
import { NFTDetails } from './NFTDetails';
import arrowRight from '/public/images/arrowRight-blue.svg';
import useRugGenesisClaimAmount from '@/hooks/useRugGenesisClaimAmount';
import useRugRadioBalance from '@/hooks/useRugRadioBalance';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import useRugRadioAllowance from '@/hooks/useRugRadioAllowance';
import AllowanceModal from './AllowanceModal';
import { fetchCollectiblesTransactions } from '@/state/assets/slice';

const COST_PER_CLAIM = parseUnits('690');

export const ClaimComponent: React.FC = () => {
  const {
    web3Reducer: {
      web3: { status, account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const [showNFTchecker, setShowNFTchecker] = useState(false);
  const [nftTokenIds, setNftTokenIds] = useState<
    | {
        tokenId: string;
        amount: number;
      }[]
    | null
  >(null);

  const chosenTokenIds = nftTokenIds?.map((nft) => nft.tokenId) ?? null;
  const totalClaims = nftTokenIds?.reduce((acc, curr) => acc + curr.amount, 0);

  const { data: remainingNFTsData, isSuccess: isRemainingNFTsDataSuccess } =
    useRugGenesisClaimAmount({
      tokenIDs: chosenTokenIds,
      enabled: Boolean(nftTokenIds)
    });

  const canNFTsBeUsedAsClaim =
    remainingNFTsData?.every((nft) => Number(nft) > 0) ?? false;

  const { data: balanceData, isSuccess: isBalanceSuccess } = useRugRadioBalance(
    { account: nftTokenIds?.length ? account : null }
  );

  const RUG_PFP_CLAIM_MODULE = '0x6dfdf07b941c91d1d58d08d5918374c922d647a1';
  const { data: allowanceData, isSuccess: isAllowanceDataSuccess } =
    useRugRadioAllowance({
      account,
      spender: RUG_PFP_CLAIM_MODULE as string,
      enabled: Boolean(nftTokenIds?.length)
    });

  const hasAllowance =
    allowanceData &&
    BigNumber.from(allowanceData).gte(COST_PER_CLAIM.mul(totalClaims ?? 0));

  const isBalanceEnough =
    nftTokenIds &&
    isBalanceSuccess &&
    totalClaims &&
    BigNumber.from(balanceData).gte(COST_PER_CLAIM.mul(totalClaims));

  // Initiate wallet connection process.
  const handleConnectWallet = (e: any): void => {
    e.preventDefault();
    dispatch(showWalletModal());
  };

  const handleClose = (): void => {
    setShowNFTchecker(false);
  };

  const handleSubmit = (
    tokenIds: {
      tokenId: string;
      amount: number;
    }[]
  ): void => {
    if (tokenIds.length === 0) return;
    setNftTokenIds(tokenIds);
  };

  const handleCloseModal = (): void => {
    setNftTokenIds(null);
    const genesisNFTContractAddress = process.env.NEXT_PUBLIC_GenesisNFT;
    dispatch(
      fetchCollectiblesTransactions({
        account,
        offset: '0',
        contractAddress: genesisNFTContractAddress,
        chainId: activeNetwork.chainId
      })
    );
  };

  const canProceedToClaim =
    isBalanceEnough && canNFTsBeUsedAsClaim && hasAllowance;

  return (
    <Layout>
      <div className="w-full">
        <div className="container mx-auto">
          {canProceedToClaim ? (
            <NFTDetails
              tokenIds={nftTokenIds}
              cost={COST_PER_CLAIM.mul(totalClaims)}
              onCloseModal={handleCloseModal}
            />
          ) : (
            <div className="w-full">
              <div className="container mx-auto space-y-14">
                <div className="max-w-480 space-y-20 mx-auto">
                  <div className="space-y-4">
                    <p className="h4 text-center">Mint NFT</p>
                    <div className="flex justify-center">
                      <Image
                        src="/images/rugRadio/pre-reveal-rr-cvl.png"
                        width={200}
                        height={200}
                        className="mx-auto"
                      />
                    </div>
                    <p className="h1 text-center">
                      RugRadio x Cory Van Lew PFP Mint
                    </p>
                  </div>
                  <div className="rounded-2.5xl">
                    <div className="p-8 bg-gray-syn8 rounded-2.5xl">
                      {status == Status.CONNECTED && (
                        <>
                          <NFTClaimer onSubmit={handleSubmit} />

                          {!hasAllowance && isAllowanceDataSuccess && (
                            <div>
                              <p className="h4 mt-8">Set allowance</p>
                              <p className="text-gray-syn4 leading-6 mt-2">
                                To use $RUG as payment you first need to set an
                                allowance.
                              </p>
                              <AllowanceModal />
                            </div>
                          )}
                          {!canNFTsBeUsedAsClaim &&
                            isRemainingNFTsDataSuccess && (
                              <p className="text-red-error font-whyte text-sm mt-2">
                                Some of your NFTs are not eligible for claiming.
                                Please check your NFTs and try again.
                              </p>
                            )}
                          {!isBalanceEnough && isBalanceSuccess && (
                            <p className="text-red-error font-whyte text-sm mt-2">
                              You don't have enough RUG tokens to mint. You may
                              have RUG tokens to mint in the{' '}
                              <span className="text-blue">
                                <Link href="/rugradio/claim">claim page</Link>
                              </span>
                              .
                            </p>
                          )}
                        </>
                      )}

                      {status === Status.DISCONNECTED && (
                        <div className="space-y-6 w-full">
                          <p className="h4">connect wallet</p>
                          <div className="space-y-4 px-1">
                            <p className="text-gray-syn4 leading-6 mt-2">
                              Connect your wallet to start the claim process
                            </p>
                          </div>
                          <CTAButton onClick={handleConnectWallet}>
                            Connect wallet
                          </CTAButton>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex mx-auto">
                  <button
                    className="flex mx-auto text-blue"
                    onClick={(): void => setShowNFTchecker(true)}
                  >
                    <span className="mr-2">
                      Check if a Genesis NFT is eligible to mint{' '}
                    </span>
                    <span className="flex h-full">
                      <Image src={arrowRight} width={16} height={16} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        {...{
          show: showNFTchecker,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: 'w-full max-w-480',
          outsideOnClick: true,
          showHeader: false,
          closeModal: () => handleClose(),
          overflowYScroll: false,
          customClassName: 'p-8 pt-6',
          overflow: 'overflow-visible'
        }}
      >
        <NFTChecker />
      </Modal>
    </Layout>
  );
};
