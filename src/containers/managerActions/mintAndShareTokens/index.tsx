import ArrowDown from "@/components/icons/arrowDown";
import { NumberField, TextField } from "@/components/inputs";
import Modal, { ModalStyle } from "@/components/modal";
import { Spinner } from "@/components/shared/spinner";
import { BlockExplorerLink } from "@/components/syndicates/shared/BlockExplorerLink";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setERC20Token } from "@/helpers/erc20TokenDetails";
import { AppState } from "@/state";
import { getWeiAmount } from "@/utils/conversions";
import { formatAddress } from "@/utils/formatAddress";
import {
  numberInputRemoveCommas,
  numberWithCommas,
} from "@/utils/formattedNumbers";
import { useClubDepositsAndSupply } from "@/hooks/useClubDepositsAndSupply";
import { ProgressModal, ProgressModalState } from "@/components/progressModal";
import MemberDetailsModal from "@/containers/managerActions/mintAndShareTokens/MemberDetailsModal";
import ConfirmMemberDetailsModal from "@/containers/managerActions/mintAndShareTokens/ConfirmMemberDetailsModal";
import { OldClubERC20Contract } from "@/ClubERC20Factory/clubERC20/oldClubERC20";
import { isDev } from "@/utils/environment";

interface Props {
  show: boolean;
  handleShow: (show: boolean) => void;
  existingMembers: any;
}

export const MintAndShareTokens: React.FC<Props> = ({
  show,
  handleShow,
  existingMembers,
}) => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: { symbol, owner, maxTotalSupply, tokenDecimals, address },
      erc20TokenContract,
    },
    web3Reducer: {
      web3: { web3 },
    },
    initializeContractsReducer: { syndicateContracts },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const [confirm, setConfirm] = useState(false);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [preview, setPreview] = useState(false);
  const [mintFailed, setMintFailed] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [userRejectedMint, setUserRejectedMint] = useState(false);

  const [memberAddress, setMemberAddress] = useState("");
  const [rawMemberAddress, setRawMemberAddress] = useState("");
  const [memberAddressError, setMemberAddressError] = useState("");
  const [amountToMint, setAmountToMint] = useState("0");
  const [amountToMintError, setAmountToMintError] = useState<
    string | React.ReactElement
  >("");
  const [totalSupplyPostMint, setTotalSupplyPostMint] = useState(0);
  const [ownershipShare, setOwnershipShare] = useState(0);

  const { totalSupply } = useClubDepositsAndSupply(address);

  useEffect(() => {
    if (totalSupply) {
      const newTotalSupply = +totalSupply + +amountToMint;
      const memberPercentShare = +amountToMint / newTotalSupply;
      setOwnershipShare(+memberPercentShare * 100);
    }
  }, [totalSupply, amountToMint]);

  const currentClubTokenSupply = +maxTotalSupply - +totalSupply;

  // tracking address here to be able to format address field.
  useEffect(() => {
    if (web3.utils.isAddress(memberAddress)) {
      setRawMemberAddress(memberAddress);
    }
  }, [memberAddress, web3?.utils]);

  const handleAddressChange = (e) => {
    const addressValue = e.target.value;
    if (rawMemberAddress) {
      setMemberAddress(rawMemberAddress.slice(0, 41));
      setRawMemberAddress("");
    } else {
      setMemberAddress(addressValue);
    }

    if (!addressValue.trim()) {
      setMemberAddressError("Member address is required.");
      setMemberAddress("");
    } else if (addressValue && !web3.utils.isAddress(addressValue)) {
      setMemberAddressError("Please provide a valid Ethereum address.");
    } else if (addressValue.toLocaleLowerCase() === owner.toLocaleLowerCase()) {
      setMemberAddressError("Club owner cannot be a member.");
    } else if (
      web3.utils.isAddress(addressValue) &&
      existingMembers.filter(
        (member) => member.memberAddress === addressValue.toLocaleLowerCase(),
      ).length > 0
    ) {
      setMemberAddressError("Address is already a member.");
    } else {
      setMemberAddressError("");
    }
  };

  const handleAmountChange = (e) => {
    const amount = numberInputRemoveCommas(e);
    if (+amount > +currentClubTokenSupply) {
      setAmountToMintError(
        <span>
          Amount exceeds available club token supply of{" "}
          <button
            onClick={() => {
              setMaxRemainingSupply();
            }}
          >
            <u>
              {numberWithCommas(currentClubTokenSupply)} {symbol}
            </u>
          </button>
        </span>,
      );
    } else if (!amount || +amount <= 0) {
      setAmountToMintError("Amount is required.");
    } else {
      setAmountToMintError("");
    }
    setAmountToMint(amount >= 0 ? amount : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreview(true);
  };

  const clearFieldErrors = () => {
    setMemberAddressError("");
    setAmountToMintError("");
    setAmountToMint("0");
    setMemberAddress("");
    setRawMemberAddress("");
  };

  useEffect(() => {
    if (amountToMint) {
      setTotalSupplyPostMint(+totalSupply + +amountToMint);
    } else {
      setTotalSupplyPostMint(+totalSupply);
    }
  }, [amountToMint, totalSupply]);

  const refreshClubDetails = () => dispatch(setERC20Token(erc20TokenContract));

  const handleCloseSuccessModal = () => {
    setConfirm(false);
    setPreview(false);
    setMinted(false);
    setMinting(false);
    setMintFailed(false);
    refreshClubDetails();

    // clear modal states
    clearFieldErrors();
  };

  if (confirm) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: "Confirm in wallet",
          description: "Please confirm the club token mint in your wallet.",
          state: ProgressModalState.CONFIRM,
        }}
      />
    );
  } else if (minting) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: "Adding member",
          description:
            "This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.",
          transactionHash: transactionHash,
          transactionType: "transaction",
          state: ProgressModalState.PENDING,
        }}
      />
    );
  } else if (minted) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: "Member added successfully",
          description: `${formatAddress(
            memberAddress,
            6,
            4,
          )} has been added as a member of this club.`,
          buttonLabel: "Done",
          buttonOnClick: handleCloseSuccessModal,
          buttonFullWidth: true,
          state: ProgressModalState.SUCCESS,
          transactionHash: transactionHash,
          transactionType: "transaction",
        }}
      />
    );
  } else if (mintFailed) {
    return (
      <ProgressModal
        {...{
          isVisible: true,
          title: "Member addition failed",
          description: "",
          buttonLabel: "Close",
          buttonOnClick: handleCloseSuccessModal,
          buttonFullWidth: true,
          state: ProgressModalState.FAILURE,
          transactionHash: userRejectedMint ? null : transactionHash,
          transactionType: "transaction",
        }}
      />
    );
  }

  const onTxConfirm = () => {
    setMinting(true);
    setConfirm(false);
  };

  const onTxReceipt = () => {
    setMinting(false);
    setMinted(true);
    refreshClubDetails();
  };

  const onTxFail = (error) => {
    setMinting(false);
    setMintFailed(true);
    setConfirm(false);
    const { code } = error;
    if (code == 4001) {
      setUserRejectedMint(true);
    } else {
      setUserRejectedMint(false);
    }
  };

  const handleMinting = async () => {
    setConfirm(true);

    const OWNER_MINT_MODULE = process.env.NEXT_PUBLIC_OWNER_MINT_MODULE;
    const useOwnerMintModule =
      await syndicateContracts.policyMintERC20.isModuleAllowed(
        erc20TokenContract.address,
        OWNER_MINT_MODULE,
      );

    if (useOwnerMintModule) {
      await syndicateContracts.OwnerMintModule.ownerMint(
        getWeiAmount(amountToMint, tokenDecimals, true),
        erc20TokenContract.address,
        memberAddress,
        owner,
        onTxConfirm,
        onTxReceipt,
        onTxFail,
        setTransactionHash,
      );
    } else {
      if (isDev) {
        await erc20TokenContract.mintTo(
          memberAddress,
          getWeiAmount(amountToMint, tokenDecimals, true),
          owner,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash,
        );
      } else {
        const oldErc20TokenContract = new OldClubERC20Contract(
          erc20TokenContract.address,
          web3,
        );

        await oldErc20TokenContract.controllerMint(
          memberAddress,
          getWeiAmount(amountToMint, tokenDecimals, true),
          owner,
          onTxConfirm,
          onTxReceipt,
          onTxFail,
          setTransactionHash,
        );
      }
    }
  };

  const setMaxRemainingSupply = () => {
    setAmountToMintError("");
    setAmountToMint(currentClubTokenSupply.toString());
  };

  return (
    <div>
      <MemberDetailsModal
        {...{
          show,
          memberAddress,
          amountToMint,
          amountToMintError,
          memberAddressError,
          symbol,
          handleShow,
          clearFieldErrors,
          handleAddressChange,
          handleSubmit,
          handleAmountChange,
          setMaxRemainingSupply,
        }}
      />

      <ConfirmMemberDetailsModal
        {...{
          preview,
          symbol,
          memberAddress,
          amountToMint,
          ownershipShare,
          totalSupply,
          totalSupplyPostMint,
          handleShow,
          setPreview,
          handleMinting,
        }}
      />
    </div>
  );
};
