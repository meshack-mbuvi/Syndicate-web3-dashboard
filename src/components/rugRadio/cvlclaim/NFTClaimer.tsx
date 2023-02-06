import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { CTAButton, CTAStyle } from '@/components/CTAButton';
import { Checkbox } from '@/components/inputs';
import { Spinner } from '@/components/shared/spinner';
import { fetchCollectiblesTransactions } from '@/state/assets/slice';
import { AppState } from '@/state';
import { SkeletonLoader } from '@/components/skeletonLoader';
import useRugGenesisClaimAmount from '@/hooks/useRugGenesisClaimAmount';
import Select from '@/components/inputs/Select';
import useRugRadioBalance from '@/hooks/useRugRadioBalance';
import { getWeiAmount } from 'src/utils/conversions';
import Link from 'next/link';

interface NFTCheckerProps {
  onSubmit: (
    nftIds: {
      tokenId: string;
      amount: number;
    }[]
  ) => void;
}

export const NFTClaimer = (props: NFTCheckerProps) => {
  const { onSubmit } = props;

  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    assetsSliceReducer: {
      collectiblesResult,
      allCollectiblesFetched,
      loadingCollectibles
    }
  } = useSelector((state: AppState) => state);

  const [collectibles, setCollectibles] = useState<
    { assetId: string }[] | null
  >(null);
  const [collectiblesTotal, setCollectibleTotals] = useState<number>(0);
  const [pageOffSet, setPageOffSet] = useState<number>(20);

  const dispatch = useDispatch();

  const genesisNFTContractAddress = process.env.NEXT_PUBLIC_GenesisNFT;
  useEffect(() => {
    if (!account || !genesisNFTContractAddress) return;

    dispatch(
      fetchCollectiblesTransactions({
        account,
        offset: '0',
        contractAddress: process.env.NEXT_PUBLIC_GenesisNFT,
        chainId: activeNetwork.chainId
      })
    );
  }, [account, genesisNFTContractAddress]);

  useEffect(() => {
    setCollectibles(collectiblesResult);

    return () => {
      setCollectibles(null);
    };
  }, [JSON.stringify(collectiblesResult)]);

  const { data: remainingNFTsData } = useRugGenesisClaimAmount({
    tokenIDs: collectibles?.map((c) => c.assetId) ?? null,
    enabled: Boolean(collectibles)
  });

  const collectiblesWithRemaining =
    collectibles &&
    remainingNFTsData &&
    collectibles
      .filter((c, id) => {
        return Number(remainingNFTsData[id]) > 0;
      })
      .map((c, id) => {
        return {
          ...c,
          remaining: remainingNFTsData[id]
        };
      });

  const { control, handleSubmit, watch } = useForm({
    mode: 'onChange'
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const claimAmounts = Object.entries(value)
        .filter(([key]) => key.includes('amount'))
        .map(([key, value]) => {
          return {
            tokenId: key.split('-')[1],
            amount: value as number
          };
        });

      const chosenTokenIds = Object.entries(value)
        .filter(([key]) => key.includes('tokenId'))
        .filter(([, value]) => value)
        .map(([key]) => key.split('-')[1]);

      const finalValues = claimAmounts.filter((claimAmount) => {
        return chosenTokenIds.includes(claimAmount.tokenId);
      });

      const totals = finalValues?.reduce((acc, curr) => acc + curr.amount, 0);

      setCollectibleTotals(totals);
    });

    return (): void => subscription.unsubscribe();
  });

  const handleFormSubmit = (values: any) => {
    const claimAmounts = Object.entries(values)
      .filter(([key]) => key.includes('amount'))
      .map(([key, value]) => {
        return {
          tokenId: key.split('-')[1],
          amount: value as number
        };
      });

    const chosenTokenIds = Object.entries(values)
      .filter(([key]) => key.includes('tokenId'))
      .filter(([, value]) => value)
      .map(([key]) => key.split('-')[1]);

    const finalValues = claimAmounts.filter((claimAmount) => {
      return chosenTokenIds.includes(claimAmount.tokenId);
    });

    onSubmit(finalValues);
  };

  const fetchMoreCollectibles = (): void => {
    setPageOffSet(pageOffSet + 20);
    dispatch(
      fetchCollectiblesTransactions({
        account,
        offset: pageOffSet.toString(),
        contractAddress: genesisNFTContractAddress,
        chainId: activeNetwork.chainId
      })
    );
  };

  const { data: balanceData, isSuccess: isBalanceSuccess } = useRugRadioBalance(
    { account: account }
  );

  return (
    <div className="bg-gray-syn8">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <p className="h4 px-1">Redeem Genesis NFTs</p>
        <div className="space-y-4 px-1">
          <p className="text-gray-syn3 leading-6 mt-2">
            To claim your RugRadio x Cory Van Lew PFP, select the eligible
            Genesis NFTs you would like to redeem claims from below. Note that
            you must hold 690 $RUG for each PFP you would like to mint.
          </p>
          <p className="text-gray-syn3 leading-6 mt-2">
            If you held $RDAO at the time of the snapshot or are a Rug Radio
            contributor,{' '}
            <span className="text-blue">
              <Link href="/rugradio/0xc28313a1080322cD4a23A89b71Ba5632D1Fc8962/rug-contributors-claim">
                click here
              </Link>
            </span>{' '}
            for your 1 free PFP claim.
          </p>
          <p className="text-gray-syn3 leading-6 my-2">
            If you held a Cory Van Lew 1 of 1 NFT at the time of the snapshot,{' '}
            <span className="text-blue">
              <Link href="/rugradio/0xc28313a1080322cD4a23A89b71Ba5632D1Fc8962/cory-van-lew-holders-claim">
                click here
              </Link>
            </span>{' '}
            for your 5 free PFP claims.
          </p>
          {!loadingCollectibles &&
            collectiblesWithRemaining &&
            collectiblesWithRemaining?.length > 0 && (
              <>
                <div className="flex flex-col">
                  {collectiblesWithRemaining.map((collectible) => {
                    return (
                      <div key={collectible.assetId} className="flex">
                        <Checkbox
                          control={control}
                          label={`Genesis #${collectible.assetId}`}
                          name={`tokenId-${collectible.assetId}`}
                          className="pt-0 pr-4 pb-4"
                        />
                        <Select
                          name={`amount-${collectible.assetId}`}
                          control={control}
                          options={[...Array(collectible.remaining)].map(
                            (_, idx) => [idx + 1, idx + 1]
                          )}
                          extraClasses="mb-4"
                        />
                      </div>
                    );
                  })}
                </div>
                {!allCollectiblesFetched && (
                  <div className="flex">
                    <CTAButton
                      onClick={fetchMoreCollectibles}
                      disabled={allCollectiblesFetched}
                      extraClasses="w-full"
                      style={CTAStyle.DARK_OUTLINED}
                    >
                      Load more
                    </CTAButton>
                  </div>
                )}
              </>
            )}
          {/* Loading state for the collectibles */}
          {loadingCollectibles && (
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, idx) => (
                <SkeletonLoader
                  key={idx}
                  width="full"
                  height="8"
                  margin="m-0"
                  borderRadius="rounded-lg"
                  animate={true}
                />
              ))}
            </div>
          )}

          {/* No collectibles found */}
          {!loadingCollectibles && collectiblesWithRemaining?.length === 0 && (
            <p className="text-yellow-warning leading-6 mt-2">
              No Genesis NFTs found. Please make sure you have connected your
              wallet and have Genesis NFTs in your wallet.
            </p>
          )}

          {collectiblesWithRemaining &&
            collectiblesWithRemaining?.length > 0 && (
              <p className="text-green font-whyte text-sm mt-2">
                {690 * collectiblesTotal} $RUG needed for this mint
              </p>
            )}

          {collectiblesWithRemaining &&
            collectiblesWithRemaining?.length > 0 && (
              <p className="text-gray-syn4 font-whyte text-sm mt-2">
                Your balance:{' '}
                {isBalanceSuccess ? getWeiAmount(balanceData, 18, false) : 0}{' '}
                $RUG
              </p>
            )}

          {collectiblesWithRemaining &&
            collectiblesWithRemaining?.length > 0 && (
              <CTAButton buttonType="submit">Redeem</CTAButton>
            )}

          {loadingCollectibles && <Spinner height="h-6" width="w-6" />}
        </div>
      </form>
    </div>
  );
};
