import Modal, { ModalStyle } from "@/components/modal";
import { AppState } from "@/state";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { NumberField } from "@/components/inputs/numberField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { isDev } from "@/utils/environment";

interface IVerifyMintPassModal {
  showModal: boolean;
  closeModal: any;
}

interface FormInputs {
  mintPassID: string;
}

const schema = () => {
  return yup.object({
    depositAmount: yup.number(),
  });
};

const VerifyMintPassModal: React.FC<IVerifyMintPassModal> = ({
  showModal,
  closeModal,
}) => {
  const {
    utilityNFTSliceReducer: { utilityNFT },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: AppState) => state);

  const { RugUtilityMintModule } = syndicateContracts;

  const [mintPassClaimed, setMintPassClaimed] = useState<boolean>(false);
  const [mintChecked, setMintChecked] = useState<boolean>(false);
  const [openseaLink, setOpenseaLink] = useState<string>("s");
  const [mintPassID, setMintPasssID] = useState<string>("");

  const { control, handleSubmit } = useForm<FormInputs>({
    mode: "onChange",
    resolver: yupResolver(schema()),
  });

  const onSubmit = async (values) => {
    if (values.mintPassID) {
      setMintPasssID(values.mintPassID);
      const response = await RugUtilityMintModule.tokenRedeemed(
        values.mintPassID,
      );
      setMintChecked(true);
      setMintPassClaimed(response);
    } else {
      setMintPasssID("");
      setMintChecked(false);
      setMintPassClaimed(false);
    }
  };

  const mintPassStatus = () => {
    return mintChecked ? (
      <img
        className="h-4 w-4"
        src={
          mintPassClaimed
            ? "/images/syndicateStatusIcons/transactionFailed.svg"
            : "/images/syndicateStatusIcons/checkCircleGreen.svg"
        }
        alt="checkmark"
      />
    ) : (
      ""
    );
  };

  useEffect(() => {
    if (mintPassID && utilityNFT.redemptionToken) {
      if (isDev) {
        setOpenseaLink(
          `https://testnets.opensea.io/assets/${utilityNFT.redemptionToken}/${mintPassID}`,
        );
      } else {
        setOpenseaLink(
          `https://opensea.io/assets/${utilityNFT.redemptionToken}/${mintPassID}`,
        );
      }
    } else {
      setOpenseaLink("");
    }
  }, [mintPassID, utilityNFT.redemptionToken]);

  const viewNFT = () => {
    window.open(openseaLink, "_blank");
  };

  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={() => {
        closeModal();
      }}
      customWidth="w-100"
      customClassName="py-8 px-10"
      showCloseButton={true}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
    >
      <div className="mx--4">
        <div className="uppercase h4 mb-8">verify mint pass</div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <NumberField
            label="Enter mint pass ID"
            name="mintPassID"
            type="number"
            placeholder="e.g. 2846"
            control={control}
            addOn={mintPassStatus()}
            info=""
            addOnStyles=""
            thousandSeparator={false}
          />
        </form>
        <div className="text-center mt-6">
          {!mintPassClaimed && mintChecked
            ? "This mint pass is unused and available to purchase on the secondary market."
            : !mintPassClaimed && !mintChecked
            ? null
            : "This mint pass has already been used to claim an NFT."}
        </div>
        {!mintPassClaimed && mintChecked ? (
          <div>
            <div className="mt-2 text-center text-sm text-gray-syn4">
              &#9888; If purchased on the secondary market, this mint pass could still
              be minted by the owner prior to the purchase completing.
            </div>

            <button
              className={`flex items-center justify-center w-full rounded-lg text-base text-black px-8 py-4 mt-6 text-black font-medium ${
                !openseaLink
                  ? "bg-gray-syn7 text-white cursor-default"
                  : "bg-white"
              }`}
              onClick={openseaLink ? viewNFT : null}
            >
              {openseaLink ? (
                <span className="flex items-center">
                  View on Opensea
                  <img
                    className="h-4 w-4 ml-2 text-white"
                    src="/images/nftClaim/opensea-black.svg"
                    alt="checkmark"
                  />
                </span>
              ) : null}
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default VerifyMintPassModal;
