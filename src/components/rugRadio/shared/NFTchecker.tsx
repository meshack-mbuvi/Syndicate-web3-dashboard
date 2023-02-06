import { CTAButton } from '@/components/CTAButton';
import { TextField } from '@/components/inputs';
import NumberTreatment from '@/components/NumberTreatment';
import { Spinner } from '@/components/shared/spinner';
import { AppState } from '@/state';
import { isDev } from '@/utils/environment';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import OpenSeaLogo from '/public/images/actionIcons/opensea-seeklogo.svg';
interface FormInputs {
  genesisNFT_ID: string;
}

const schema = () =>
  yup.object({
    genesisNFT_ID: yup.string().required('Genesis NFT id is required')
  });

export const NFTChecker: React.FC = () => {
  const genesisNFTContractAddress = process.env.NEXT_PUBLIC_GenesisNFT;

  const {
    web3Reducer: {
      web3: {
        ethereumNetwork: { invalidEthereumNetwork }
      }
    },
    initializeContractsReducer: {
      syndicateContracts: {
        RugClaimModule,
        RugUtilityProperty,
        GenesisNFTContract,
        rugBonusClaimModule
      }
    }
  } = useSelector((state: AppState) => state);

  const [loading, setLoading] = useState(false);
  const [nftFound, setNftFound] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(0);

  const openseaAssetBaseUrl = isDev
    ? `https://testnets.opensea.io/${genesisNFTContractAddress}`
    : `https://opensea.io/assets/${genesisNFTContractAddress}`;

  const [{ tokenBalance, tokenProduction, tokenBonus }, setTokenProperties] =
    useState({
      tokenBalance: '0',
      tokenProduction: '0',
      tokenBonus: '0'
    });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid }
  } = useForm<FormInputs>({
    resolver: yupResolver(schema()),
    mode: 'onChange'
  });

  const { genesisNFT_ID } = watch();

  useEffect(() => {
    if (!GenesisNFTContract) return;

    GenesisNFTContract.currentSupply().then((supply: any) =>
      setCurrentSupply(+supply)
    );
    return () => {
      setCurrentSupply(0);
    };
  }, [GenesisNFTContract]);

  useEffect(() => {
    setNftFound(false);
    setShowError(false);

    return () => {
      setNftFound(false);
    };
  }, [genesisNFT_ID]);

  const getTokenProperties = async (tokenId: any) => {
    if (tokenId > +currentSupply || tokenId == 0) {
      setNftFound(false);
    } else {
      setNftFound(true);
    }

    setLoading(true);

    try {
      const tokenBalance = await RugClaimModule.getClaimAmount(tokenId);
      const tokenProduction = await RugUtilityProperty.getProduction(tokenId);
      const tokenBonus = await rugBonusClaimModule.getClaimAmount(tokenId);

      setTokenProperties({
        tokenBalance,
        tokenProduction,
        tokenBonus
      });
      setNftFound(true);
      setShowError(false);

      setLoading(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const onSubmit = (values: any) => {
    const { genesisNFT_ID } = values;

    if (!genesisNFT_ID) return;

    getTokenProperties(+genesisNFT_ID.trim());
  };

  return (
    <div className="bg-gray-syn8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="h4 px-1">check genesis nft</p>
        <div className="space-y-4 px-1">
          <p className="text-gray-syn4 leading-6 mt-2">
            To find out how many RUG tokens are available to claim for any
            RugRadio Genesis NFT, enter its ID below.
          </p>

          <TextField
            control={control}
            label="Genesis NFT ID"
            name="genesisNFT_ID"
            placeholder="e.g. 2846"
            showClearIcon={true}
          />

          {showError == true && (
            <p className="text-red-error font-whyte text-sm mt-2">
              This NFT ID does not exist or Opensea currently is rate limited.
            </p>
          )}

          {nftFound == false && !loading && (
            <CTAButton buttonType="submit" disabled={!isValid || loading}>
              Check
            </CTAButton>
          )}

          {loading ? <Spinner height="h-6" width="w-6" /> : null}

          {nftFound && !showError && !loading && !invalidEthereumNetwork ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-center leading-6">
                  <NumberTreatment
                    numberValue={`${
                      parseInt(tokenBalance) + parseInt(tokenBonus)
                    }`}
                  />
                  {` unclaimed RUG tokens (including a ${tokenBonus} RUG bonus),
                  generating ${tokenProduction} RUG per day.`}
                </p>

                <p className="text-gray-syn4 small-body text-center leading-5.5">
                  If purchased on the secondary market, the unclaimed RUG from
                  this Genesis NFT could still be claimed by the owner prior to
                  the purchase completing.
                </p>
              </div>

              {genesisNFT_ID &&
              nftFound &&
              !showError &&
              !loading &&
              !invalidEthereumNetwork ? (
                <a
                  href={`${openseaAssetBaseUrl}/${genesisNFT_ID}`}
                  className="flex justify-center border cursor-pointer text-center w-full px-8 py-3.5 rounded-lg focus:outline-none bg-white text-black"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex">
                    View on opensea{' '}
                    <span className="ml-1 flex">
                      <Image
                        src={OpenSeaLogo}
                        width={16}
                        height={16}
                        alt="Opensea logo"
                      />
                    </span>
                  </span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};
