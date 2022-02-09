import { CtaButton } from "@/components/CTAButton";
import { TextField } from "@/components/inputs";
import NumberTreatment from "@/components/NumberTreatment";
import { Spinner } from "@/components/shared/spinner";
import { AppState } from "@/state";
import { fetchCollectibleById } from "@/state/assets/slice";
import { getWeiAmount } from "@/utils/conversions";
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

const schema = (currentSupply) =>
  yup.object({
    genesisNFT_ID: yup
      .number()
      .required("Genesis NFT id is required")
      .max(currentSupply, "This NFT ID does not exist."),
  });

export const NFTChecker: React.FC = () => {
  const {
    web3Reducer: {
      web3: { account },
    },
    initializeContractsReducer: {
      syndicateContracts: { RugClaimModule, RugUtilityProperty, RugToken },
    },
  } = useSelector((state: AppState) => state);

  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(0);

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
    resolver: yupResolver(schema(currentSupply)),
    mode: "onChange",
  });

  const { genesisNFT_ID } = watch();

  useEffect(() => {
    if (!RugToken) return;

    RugToken.totalSupply().then(async (totalSupply) =>
      setCurrentSupply(
        +getWeiAmount(totalSupply, parseInt(await RugToken.decimals()), false),
      ),
    );

    return () => {
      setCurrentSupply(0);
    };
  }, [RugToken]);
  console.log({ currentSupply });
  useEffect(() => {
    if (!genesisNFT_ID || +genesisNFT_ID > currentSupply) {
      setShowDetails(false);
    }

    return () => {
      setShowDetails(false);
    };
  }, [genesisNFT_ID]);

  const genesisNFTContractAddress = process.env.NEXT_PUBLIC_GenesisNFT;

  const getTokenProperties = async (tokenId) => {
    setLoading(true);

    const tokenBalance = await RugClaimModule.getClaimAmount(tokenId);
    const tokenProduction = await RugUtilityProperty.getProduction(tokenId);
    const tokenDetails = await fetchCollectibleById({
      account,
      offset: "0",
      contractAddress: genesisNFTContractAddress,
      tokenId: genesisNFT_ID,
    });

    setTokenProperties({
      tokenBalance,
      tokenProduction,
      permalink: tokenDetails?.permalink,
    });
    setLoading(false);
    setShowDetails(true);
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

          {showDetails == false && !loading && (
            <CtaButton type="submit" disabled={!isValid || loading}>
              Check
            </CtaButton>
          )}

          {loading ? <Spinner height="h-6" width="w-6" /> : null}

          {/* Show this section when check is done */}
          {showDetails ? (
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

              {/* Some tokens don't exist in opensea */}
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
