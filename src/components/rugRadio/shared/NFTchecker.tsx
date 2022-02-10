import { CtaButton } from "@/components/CTAButton";
import { TextField } from "@/components/inputs";
import NumberTreatment from "@/components/NumberTreatment";
import { Spinner } from "@/components/shared/spinner";
import { AppState } from "@/state";
import { fetchCollectibleById } from "@/state/assets/slice";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import OpenSeaLogo from "/public/images/actionIcons/opensea-seeklogo.svg";
interface FormInputs {
  genesisNFT_ID: string;
}

const schema = () =>
  yup.object({
    genesisNFT_ID: yup.string().required("Genesis NFT id is required"),
  });

export const NFTChecker: React.FC = () => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { RugClaimModule, RugUtilityProperty },
    },
  } = useSelector((state: AppState) => state);

  const [loading, setLoading] = useState(false);
  const [nftFound, setNftFound] = useState(false);
  const [showError, setShowError] = useState(false);

  const [{ tokenBalance, tokenProduction, permalink }, setTokenProperties] =
    useState({
      tokenBalance: "0",
      tokenProduction: "0",
      permalink: "",
    });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema()),
    mode: "onChange",
  });

  const { genesisNFT_ID } = watch();

  useEffect(() => {
    setNftFound(false);
    setShowError(false);

    return () => {
      setNftFound(false);
    };
  }, [genesisNFT_ID]);

  const genesisNFTContractAddress = process.env.NEXT_PUBLIC_GenesisNFT;

  const getTokenProperties = async (tokenId) => {
    setLoading(true);

    try {
      const tokenDetails = await fetchCollectibleById({
        offset: "0",
        contractAddress: genesisNFTContractAddress,
        tokenId: genesisNFT_ID,
      });

      if (tokenDetails) {
        const tokenBalance = await RugClaimModule.getClaimAmount(tokenId);
        const tokenProduction = await RugUtilityProperty.getProduction(tokenId);

        setTokenProperties({
          tokenBalance,
          tokenProduction,
          permalink: tokenDetails?.permalink,
        });
        setNftFound(true);
        setShowError(false);
      } else {
        setShowError(true);
      }

      setLoading(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const onSubmit = (values) => {
    const { genesisNFT_ID } = values;

    if (!genesisNFT_ID) return;

    getTokenProperties(genesisNFT_ID);
  };

  return (
    <div className="bg-gray-syn8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="h4">check genesis nft</p>
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
            <CtaButton type="submit" disabled={!isValid || loading}>
              Check
            </CtaButton>
          )}

          {loading ? <Spinner height="h-6" width="w-6" /> : null}

          {nftFound ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-center leading-6">
                  <NumberTreatment numberValue={tokenBalance} /> unclaimed RUG
                  tokens, generating {tokenProduction} RUG per day.
                </p>

                <p className="text-gray-syn4 small-body text-center leading-5.5">
                  If purchased on the secondary market, the unclaimed RUG from
                  this Genesis NFT could still be claimed by the owner prior to
                  the purchase completing.
                </p>
              </div>

              {permalink ? (
                <a
                  href={permalink}
                  className="flex justify-center border cursor-pointer text-center w-full px-8 py-3.5 rounded-lg focus:outline-none bg-white text-black"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="flex">
                    View on opensea{" "}
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
