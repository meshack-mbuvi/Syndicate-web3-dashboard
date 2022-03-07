import React from "react";
import Modal, { ModalStyle } from "@/components/modal";
import Image from "next/image";

interface ICryptoAssetModal {
  showModal: boolean;
  closeModal: any;
}

const AssetInfoModal: React.FC<ICryptoAssetModal> = ({
  showModal,
  closeModal,
}) => {
  return (
    <Modal
      {...{
        modalStyle: ModalStyle.DARK,
        show: showModal,
        closeModal: () => closeModal(),
        customWidth: "w-100",
        customClassName: "p-8",
        showCloseButton: false,
        outsideOnClick: true,
        showHeader: false,
        alignment: "align-top",
        margin: "mt-48",
      }}
    >
      <div className="">
        <div className="flex">
          <button className="mr-4 items-center focus:outline-none" onClick={() => closeModal()}>
            <Image src={"/images/arrowBackWhite.svg"} width={16} height={16} />
          </button>
          <div className="inline-flex">
            <p className="text-xl leading-4 tracking-px text-white">
              Each crypto asset is different
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-syn4 leading-5 mt-4">
          Crypto is a new asset class and is subject to many risks including
          frequent price changes. All crypto assets are different. Each one has
          its own set of features and risks that could affect its value and how
          you're able to use it. Be sure to research any asset fully before
          selecting. Syndicate strongly encourages all groups to consult with
          their legal and tax advisors prior to launch.
        </p>
        <button
          className="bg-white rounded-custom w-full flex items-center justify-center py-4 px-8 mt-10"
          onClick={() => closeModal()}
        >
          <p className="text-black whitespace-nowrap text-base font-whyte font-bold">
            Back
          </p>
        </button>
      </div>
    </Modal>
  );
};

export default AssetInfoModal;
