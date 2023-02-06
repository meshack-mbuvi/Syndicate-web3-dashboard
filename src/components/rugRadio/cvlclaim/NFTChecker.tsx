import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { CTAButton } from '@/components/CTAButton';
import { TextField } from '@/components/inputs';
import { Spinner } from '@/components/shared/spinner';
import useRugGenesisClaimAmount from '@/hooks/useRugGenesisClaimAmount';

interface FormInputs {
  genesisNFT_ID: string;
}

const schema = () =>
  yup.object({
    genesisNFT_ID: yup
      .number()
      .required('Genesis NFT id is required')
      .max(20_000, "Genesis NFT token id can't be greater than 20,000")
  });

export const NFTChecker = () => {
  const [tokenId, setTokenId] = useState<number | null>(null);
  const tokenIdAsString = tokenId?.toString();
  const {
    data: claimAmountsData,
    isLoading,
    isSuccess,
    isFetched,
    isFetching
  } = useRugGenesisClaimAmount({
    tokenIDs: tokenIdAsString ? [tokenIdAsString] : null,
    enabled: Boolean(tokenId)
  });

  const {
    control,
    handleSubmit,
    formState: { isValid: isValidForm },
    watch
  } = useForm<FormInputs>({
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

  // When a user starts editing the field again we need to reset the validation state
  useEffect(() => {
    const subscription = watch(() => setTokenId(null));
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleFormSubmit = (values: any) => {
    const { genesisNFT_ID } = values;
    setTokenId(genesisNFT_ID);
  };

  const claimAmounts = Number(claimAmountsData?.[0]);
  const isValid = claimAmounts > 0;

  return (
    <div className="bg-gray-syn8">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <p className="h4 px-1">check genesis nft</p>
        <div className="space-y-4 px-1">
          <p className="text-gray-syn4 leading-6 mt-2">
            To find out if this token is eligible to mint the RugRadio x Cory
            Van Lew PFP, enter its ID below.
          </p>

          <TextField
            control={control}
            label="Genesis NFT ID"
            name="genesisNFT_ID"
            placeholder="e.g. 2846"
            showClearIcon={true}
          />

          {isSuccess && !isValid && (
            <p className="text-red-error font-whyte text-sm mt-2">
              This Genesis NFT has already claimed its Cory Van Lew PFP NFTs.
            </p>
          )}

          {isSuccess && isValid && (
            <>
              <p className="text-green font-whyte text-sm mt-2">
                This Genesis NFT is eligible to to claim <b>{claimAmounts}</b>{' '}
                Cory Van Lew PFP NFT(s).
              </p>
              <p className="text-gray-syn4 font-whyte text-sm mt-2">
                If you are purchasing this Genesis NFT, the prior owner could
                claim before your purchase finishes processing.
              </p>
            </>
          )}

          <CTAButton buttonType="submit" disabled={!isValidForm || isFetching}>
            Check
          </CTAButton>

          {isFetched && isLoading && <Spinner height="h-6" width="w-6" />}
        </div>
      </form>
    </div>
  );
};
