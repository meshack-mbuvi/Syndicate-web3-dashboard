import ArrowDown from "@/components/icons/arrowDown";
import { NumberField, TextField } from "@/components/inputs";
import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { setERC20Token } from "@/helpers/erc20TokenDetails";
import { useDemoMode } from "@/hooks/useDemoMode";
import { AppState } from "@/state";
import { getWeiAmount } from "@/utils/conversions";
import { formatAddress } from "@/utils/formatAddress";
import {
  floatedNumberWithCommas,
  numberWithCommas,
} from "@/utils/formattedNumbers";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

interface Props {
  show: boolean;
  handleShow: (show: boolean) => void;
}
interface FormInputs {
  recipientAddress: string;
  amount: string;
}

const schema = (maximumTokensToMint, web3) =>
  yup.object({
    recipientAddress: yup
      .string()
      .trim()
      .required("Recipient address is required")
      .test(
        "recipientAddress",
        "Address must be a valid Ethereum address",
        (value) => {
          if (value) {
            return web3.utils.isAddress(value);
          }
          return true;
        },
      ),
    amount: yup
      .number()
      .required("Amount is required")
      .moreThan(0)
      .max(
        maximumTokensToMint,
        `Amount must be less or equal to ${numberWithCommas(
          maximumTokensToMint,
        )}`,
      )
      .typeError("Only numbers are supported."),
  });

const DetailContent = ({ label, value, symbol }) => (
  <div className="flex justify-between">
    <span className="text-gray-syn4 font-whyte text-base leading-6">
      {label}
    </span>
    <span>
      {numberWithCommas(value)} {symbol}
    </span>
  </div>
);

export const MintAndShareTokens: React.FC<Props> = (props) => {
  const {
    initializeContractsReducer: { syndicateContracts },
    erc20TokenSliceReducer: {
      erc20Token: { symbol, owner, maxTotalSupply, totalSupply, tokenDecimals },
      erc20TokenContract,
    },
    web3Reducer: {
      web3: { web3 },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const isDemoMode = useDemoMode();

  const [confirm, setConfirm] = useState(false);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [mintFailed, setMintFailed] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [userRejectedMint, setUserRejectedMint] = useState(false);

  const ownershipShare = 30;

  const { show, handleShow } = props;
  const maximumTokensToMint = +maxTotalSupply - +totalSupply;

  const {
    control,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema(maximumTokensToMint, web3)),
    mode: "onChange",
  });

  const { recipientAddress, amount } = watch();
  const showWarning = recipientAddress === owner ? true : false;

  const [totalSupplyPostMint, setTotalSupplyPostMint] = useState(0);
  const remainingSupply = +maxTotalSupply - totalSupplyPostMint;

  useEffect(() => {
    if (amount) {
      setTotalSupplyPostMint(parseInt(totalSupply.toString(), 10) + +amount);
    } else {
      setTotalSupplyPostMint(+totalSupply);
    }
  }, [amount, totalSupply]);

  const onConfirm = () => {
    setConfirm(true);
    handleShow(false);
  };

  const [showProcessingMint, setShowProcessingMint] = useState(false);

  const refreshClubDetails = () =>
    dispatch(
      setERC20Token(
        erc20TokenContract,
        syndicateContracts.SingleTokenMintModule,
      ),
    );

  const handleCloseSuccessModal = () => {
    setConfirm(false);
    setShowProcessingMint(false);
    modalContent = <></>;
    setMinted(false);
    setMinting(false);
    setMintFailed(false);
    refreshClubDetails();
  };

  /**
   * Modal content depending on what state the process is in.
   */
  let modalContent = (
    <div className="space-y-10">
      <div>
        <Spinner width="w-10" height="h-10" margin="m-0" />
      </div>
      <div className="space-y-4 font-whyte">
        <p className="text-center text-xl">Confirm in wallet</p>
        <p className="text-gray-syn4 text-center text-base">
          Please confirm the club token mint in your wallet.
        </p>
      </div>
    </div>
  );

  if (confirm) {
    modalContent = (
      <div className="space-y-10">
        <div>
          <Spinner width="w-10" height="h-10" margin="m-0" />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Confirm in wallet</p>
          <p className="text-gray-syn4 text-center text-base">
            This could take anywhere from seconds to hours depending on network
            congestion and the gas fees you set. You can safely leave this page
            while you wait.
          </p>
        </div>
      </div>
    );
  } else if (minting) {
    modalContent = (
      <div className="space-y-10">
        <div>
          <Spinner width="w-10" height="h-10" margin="m-0" />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Minting tokens</p>
          <p className="text-gray-syn4 text-center text-base leading-6">
            This could take anywhere from seconds to hours depending on network
            congestion and the gas fees you set. You can safely leave this page
            while you wait.
          </p>
          <div className="text-base flex justify-center items-center hover:opacity-80">
            <EtherscanLink
              etherscanInfo={transactionHash}
              type="transaction"
              grayIcon
            />
          </div>
        </div>
      </div>
    );
  } else if (minted) {
    modalContent = (
      <div className="space-y-10">
        <div className="flex justify-center">
          <img
            className="h-16 w-16"
            src="/images/syndicateStatusIcons/checkCircleGreen.svg"
            alt="checkmark"
          />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Tokens successfully minted</p>
          <p className="text-gray-syn4 text-center text-base leading-6">
            {`${numberWithCommas(
              amount,
            )} ${symbol} have been minted and sent to ${formatAddress(
              recipientAddress,
              6,
              4,
            )}.`}
          </p>
          <div className="text-base flex justify-center items-center hover:opacity-80">
            <EtherscanLink
              etherscanInfo={transactionHash}
              type="transaction"
              grayIcon
            />
          </div>
        </div>
        <button
          className={`w-full primary-CTA hover:opacity-90 transition-all`}
          type="button"
          onClick={handleCloseSuccessModal}
        >
          Done
        </button>
      </div>
    );
  } else if (mintFailed) {
    modalContent = (
      <div className="space-y-10">
        <div className="flex justify-center">
          <img
            className="h-16 w-16"
            src="/images/syndicateStatusIcons/transactionFailed.svg"
            alt="checkmark"
          />
        </div>
        <div className="space-y-4 font-whyte">
          <p className="text-center text-xl">Tokens minting failed.</p>
          {!userRejectedMint ? (
            <div className="text-base flex justify-center items-center hover:opacity-80">
              <EtherscanLink
                etherscanInfo={transactionHash}
                type="transaction"
                grayIcon
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <button
          className={`w-full primary-CTA hover:opacity-90 transition-all`}
          type="button"
          onClick={handleCloseSuccessModal}
        >
          Close
        </button>
      </div>
    );
  }

  const onTxConfirm = () => {
    setMinting(true);
  };

  const onTxReceipt = () => {
    setMinting(false);
    setMinted(true);
    refreshClubDetails();
  };

  const onTxFail = (error) => {
    setMinting(false);
    setMintFailed(true);
    const { code } = error;
    if (code == 4001) {
      setUserRejectedMint(true);
    } else {
      setUserRejectedMint(false);
    }
  };

  const handleMinting = async () => {
    setConfirm(false);
    setShowProcessingMint(true);
    await erc20TokenContract.mintTo(
      recipientAddress,
      getWeiAmount(amount, tokenDecimals, true),
      owner,
      onTxConfirm,
      onTxReceipt,
      onTxFail,
      setTransactionHash,
    );
  };

  return (
    <div>
      <Modal
        {...{
          show,
          modalStyle: ModalStyle.DARK,
          showCloseButton: true,
          customWidth: "w-full max-w-480",
          outsideOnClick: true,
          closeModal: () => handleShow(false),
          customClassName: "py-8 px-10",
          showHeader: false,
          overflowYScroll: false,
          overflow: "overflow-visible",
        }}
      >
        <div className="space-y-6">
          <h1 className="uppercase font-whyte text-sm leading-4 tracking-px">
            mint club tokens
          </h1>
          <p className="text-gray-syn4 text-base font-whyte leading-6">
            To manually mint club tokens, enter the amount of tokens to mint and
            the address to send them to.
          </p>

          <form onSubmit={handleSubmit(onConfirm)} className="space-y-6">
            <NumberField
              control={control}
              addOn={symbol}
              label="Amount to mint"
              name="amount"
              placeholder="0"
              addOnStyles=""
              maximumValue={maximumTokensToMint}
              maxButtonEnabled={true}
            />

            <TextField
              control={control}
              label="Recipient address"
              name="recipientAddress"
              placeholder="0x..."
              warningText="Tokens minted to your own address are transferable. 
              If you transfer these tokens to other wallets, we will no longer 
              be able to track the ownership share those tokens represent."
              showWarning={showWarning}
            />

            <button
              className={`w-full ${
                !isValid || isDemoMode
                  ? "primary-CTA-disabled text-gray-lightManatee"
                  : "primary-CTA hover:opacity-90 transition-all"
              }`}
              type="submit"
              disabled={!isValid || isDemoMode}
            >
              Continue
            </button>
          </form>
        </div>
      </Modal>

      {/* Confirm club tokens to mint */}
      <Modal
        {...{
          show: confirm,
          modalStyle: ModalStyle.DARK,
          showCloseButton: true,
          customWidth: "w-full max-w-480",
          outsideOnClick: true,
          closeModal: () => {
            handleShow(true);
            setConfirm(false);
          },
          customClassName: "py-8 px-5",
          showHeader: false,
          overflowYScroll: false,
          overflow: "overflow-visible",
        }}
      >
        <div className="space-y-6">
          <h1 className="uppercase mx-5 mb-8 font-whyte text-sm leading-4 tracking-px">
            confirm mint
          </h1>

          <div className="mt-8 rounded-lg border-gray-syn6 border relative">
            <div className="py-4 px-5 border-gray-syn6 border-b">
              <p className="text-base text-gray-syn4 leading-6 font-whyte">
                Mint amount
              </p>
              <div className="flex items-center justify-between mt-1 space-y-1">
                <p className="text-2xl">{floatedNumberWithCommas(amount)}</p>
                <p className="text-base leading-6">{symbol}</p>
              </div>

              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-syn4">
                  {floatedNumberWithCommas(ownershipShare) === "< 0.01"
                    ? null
                    : "= "}
                  {floatedNumberWithCommas(ownershipShare)}% ownership share
                </p>
              </div>
            </div>
            <div
              className={`absolute p-2 bg-gray-syn8 border-gray-syn6 border rounded-lg`}
              style={{ top: "calc(50% - 2px)", left: "calc(50% - 12px)" }}
            >
              <ArrowDown />
            </div>
            <div className="py-4 px-5 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-base text-gray-syn4 leading-6">
                  Recipient address
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-2xl">
                  {formatAddress(recipientAddress, 6, 6)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 space-y-6">
            <DetailContent
              label="Club token max supply"
              value={maxTotalSupply}
              symbol={symbol}
            />
            <DetailContent
              label="Total club tokens minted"
              value={totalSupplyPostMint}
              symbol={symbol}
            />
            <div className="border-b-1 border-gray-syn6" />
            <DetailContent
              label="Club tokens remaining post-mint"
              value={remainingSupply}
              symbol={symbol}
            />
            <button
              className={`w-full primary-CTA hover:opacity-90 transition-all`}
              type="button"
              onClick={handleMinting}
            >
              Complete mint
            </button>
          </div>
        </div>
      </Modal>

      {/* Processing mint */}
      <Modal
        {...{
          show: showProcessingMint,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: "w-full max-w-480",
          outsideOnClick: false,
          customClassName: "p-10",
          showHeader: false,
          overflowYScroll: false,
          overflow: "overflow-visible",
        }}
      >
        {modalContent}
      </Modal>
    </div>
  );
};
