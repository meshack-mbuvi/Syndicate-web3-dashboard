import React from "react";
import Modal, { ModalStyle } from "@/components/modal";
import { CategoryPill } from "../../../activity/shared/CategoryPill";
import GradientAvatar from "@/components/syndicates/portfolioAndDiscover/portfolio/GradientAvatar";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import TokenDetail from "../../collectibles/shared/TokenDetail";

interface ITokenModal {
  showModal: boolean;
  closeModal: any;
  tokenDetails: any;
}

const TokenModal: React.FC<ITokenModal> = ({
  showModal,
  closeModal,
  tokenDetails,
}) => {
  const clubBalance = floatedNumberWithCommas(tokenDetails.tokenBalance);
  const addGrayToDecimalInput = (str) => {
    if (typeof str !== "string") {
      str.toString();
    }
    const [wholeNumber, decimalPart] = str.split(".");
    return (
      <div className="flex">
        {wholeNumber ? <p className="text-white">{wholeNumber}</p> : null}
        {decimalPart ? <p className="text-gray-syn4">.{decimalPart}</p> : null}
      </div>
    );
  };

  const additionaDetails = {
    "Token name": tokenDetails.tokenName,
    "Club balance": tokenDetails.tokenBalance,
    Value: tokenDetails.value,
  };
  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={() => closeModal()}
      customWidth="w-564"
      customClassName="p-0"
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
    >
      <div>
        <div className="flex rounded-t-2xl items-center flex-col relative py-10 px-5 bg-gray-syn7">
          <div className="mb-8">
            <CategoryPill category="TOKEN" readonly={true} />
          </div>
          <div className="flex items-center">
            {tokenDetails.logo ? (
              <img
                alt="token-icon"
                src={tokenDetails.logo}
                className="w-6 h-6"
              />
            ) : (
              <GradientAvatar name={tokenDetails.tokenName} size={"w-6 h-6"} />
            )}
            <div className="inline-flex pl-2 text-xl">
              {tokenDetails.tokenSymbol}
            </div>
          </div>
          <div className="mt-4 text-4.5xl">
            {addGrayToDecimalInput(
              floatedNumberWithCommas(tokenDetails?.tokenBalance),
            )}
          </div>
        </div>
        <div className="flex flex-col p-10 text-base">
          {tokenDetails.description && (
            <div className="mb-10">
              <span>Description</span>
              <p className="mt-4 text-gray-syn4 break-words">
                {tokenDetails.description}
              </p>
            </div>
          )}
          <div>
            <p>Details</p>
            {Object.keys(additionaDetails).map((key, index) => {
              return (
                <div key={index}>
                  <TokenDetail
                    title={key}
                    value={additionaDetails[key]}
                    symbol={tokenDetails.tokenSymbol}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TokenModal;