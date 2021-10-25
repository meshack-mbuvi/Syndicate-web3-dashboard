import { amplitudeLogger, Flow } from "@/components/amplitude";
import {
  APPROVE_DEPOSIT_ALLOWANCE,
  ERROR_APPROVE_ALLOWANCE,
  ERROR_DEPOSIT,
  SUCCESSFUL_DEPOSIT,
} from "@/components/amplitude/eventNames";
import ErrorBoundary from "@/components/errorBoundary";
import FadeIn from "@/components/fadeIn/FadeIn";
import { setSyndicateDetails } from "@/redux/actions/syndicateDetails";
import { updateMemberDepositDetails } from "@/redux/actions/syndicateMemberDetails/memberDepositsInfo";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ERC20ABI from "src/utils/abi/erc20";
import { getGnosisTxnInfo } from "src/syndicateClosedEndFundLogic/shared/gnosisTransactionInfo";

import Modal, { ModalStyle } from "@/components/modal";
import ArrowDown from "@/components/icons/arrowDown";
import useModal from "@/hooks/useModal";
import { InfoIcon } from "src/components/iconWrappers";
import useSyndicateClubInfo from "@/hooks/deposit/useSyndicateClubInfo";
import { CheckIcon } from "@heroicons/react/solid";
import { AbiItem } from "web3-utils";
import StatusBadge from "@/components/syndicateDetails/statusBadge";
import Image from "next/image";
import { useERC20TokenBalance } from "@/hooks/useTokenBalance";
import useUSDCDetails from "@/hooks/useUSDCDetails";
import AutoGrowInputField from "@/components/inputs/autoGrowInput";
import { Spinner } from "@/components/shared/spinner";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { isDev } from "@/utils/environment";
import { SkeletonLoader } from "src/components/skeletonLoader";
import ReactTooltip from "react-tooltip";

const DepositSyndicate: React.FC = () => {
  // HOOK DECLARATIONS
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    syndicatesReducer: { syndicate },
    web3Reducer: {
      web3: { account, web3 },
    },
    syndicateMemberDetailsReducer: { memberDepositDetails },
  } = useSelector((state: RootState) => state);

  const {
    depositTokenAddress,
    depositTokenSymbol,
    depositTokenLogo,
    depositTokenDecimals,
  } = useUSDCDetails();

  const { memberTotalDeposits } = memberDepositDetails;

  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [metamaskConfirmPending, setMetamaskConfirmPending] =
    useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [allowanceApprovalError, setAllowanceApprovalError] =
    useState<string>("");
  const [approvedAllowanceAmount, setApprovedAllowanceAmount] =
    useState<string>("0");
  const [successfulDeposit, setSuccessfulDeposit] = useState<boolean>(false);
  const [depositTokenContract, setDepositTokenContract] = useState<any>({});
  const [submittingAllowanceApproval, setSubmittingAllowanceApproval] =
    useState<boolean>(false);

  const [unlimitedAllowanceSet, setUnlimitedAllowanceSet] =
    useState<boolean>(false);
  const [currentMemberAllowance, setCurrentMemberAllowance] =
    useState<string>("0");
  const [insufficientBalance, setInsufficientBalance] =
    useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");

  // DEFINITIONS
  const { syndicateAddress } = router.query;

  // get values for the current LP(connected wallet account)
  // when this component initially renders.
  useEffect(() => {
    if (account && syndicateContracts && syndicate) {
      // push member details to the redux store
      storeMemberDetails();
    }
  }, [account, syndicate, syndicateContracts, depositTokenDecimals]);

  useEffect(() => {
    if (syndicateContracts && syndicate) {
      // set up current deposit ERC20Contract and
      // and save it to the local state
      const ERC20Contract = new web3.eth.Contract(
        ERC20ABI as AbiItem[],
        syndicate.depositERC20Address,
      );

      setDepositTokenContract(ERC20Contract);
    }
  }, [syndicateContracts, syndicate]);

  // COMPONENT FUNCTIONS

  /** Method to store updated member details in the redux store
   * This will be called whenever member details need to be updated
   * after an action.
   */
  const storeMemberDetails = () => {
    dispatch(
      updateMemberDepositDetails({
        syndicateAddress,
        depositTokenDecimals,
      }),
    );
  };

  /**
   * This methods is used to invest in LP(syndicate)
   * The account that is investing is obtained from the connected wallet from
   * which funds will be transferred.
   * The syndicate address is obtained from the page params
   * @param {object} data contains amount, and accredited
   */

  const investInSyndicate = async (amount: string) => {
    setCurrentTransaction(2);

    const amountToInvest = getWeiAmount(
      amount.toString(),
      depositTokenDecimals,
      true,
    );

    setMetamaskConfirmPending(true);

    try {
      await syndicateContracts.DepositLogicContract.deposit({
        syndicateAddress: syndicate.syndicateAddress,
        account,
        amount: amountToInvest,
        setMetamaskConfirmPending,
        setSubmitting,
        setTransactionHash,
      });

      dispatch(
        getSyndicateByAddress({
          syndicateAddress: syndicate.syndicateAddress,
          ...syndicateContracts,
        }),
      );

      //store updated member details
      storeMemberDetails();

      if (approved) {
        setApproved(false);
      }

      // reset allowance error
      if (allowanceApprovalError) {
        setAllowanceApprovalError("");
      }
      // reset approval amount
      if (approvedAllowanceAmount) {
        setApprovedAllowanceAmount("0");
      }
      // cancel submitting state and show success notification.
      setSubmitting(false);
      setSuccessfulDeposit(true);

      // Amplitude logger: Deposit funds
      amplitudeLogger(SUCCESSFUL_DEPOSIT, {
        flow: Flow.MBR_DEP,
        amount,
      });
    } catch (error) {
      setSubmitting(false);

      // Amplitude logger: Deposit funds Error
      amplitudeLogger(ERROR_DEPOSIT, {
        flow: Flow.MBR_DEP,
        amount,
        error,
      });
    }

    // dispatch action to get details about the syndicate
    // These values will be used to update syndicate details
    // under the graph section on the UI.
    const {
      depositERC20Address,
      distributionShareToSyndicateLead,
      distributionShareToSyndicateProtocol,
    } = syndicate;
    dispatch(
      setSyndicateDetails(
        syndicateContracts,
        depositERC20Address,
        distributionShareToSyndicateLead,
        distributionShareToSyndicateProtocol,
        syndicate,
        syndicateAddress,
      ),
    );
  };

  /**
   *
   * @returns {string} balance of the user for the deposit ERC20 token
   */
  const checkTokenBalance = async () => {
    try {
      const balance = await depositTokenContract.methods
        .balanceOf(account.toString())
        .call({ from: account });

      const weiBalance = getWeiAmount(balance, depositTokenDecimals, false);
      if (+weiBalance < +depositAmount) {
        setInsufficientBalance(true);
      } else {
        setInsufficientBalance(false);
      }
      return weiBalance;
    } catch {
      return 0;
    }
  };

  const erc20Balance = useERC20TokenBalance(
    account,
    new web3.eth.Contract(ERC20ABI as AbiItem[], depositTokenAddress),
    depositTokenDecimals,
  );

  const { syndicateClubLogo, syndicateClubSymbol } = useSyndicateClubInfo();

  const [depositAmount, setDepositAmount] = useState("");
  const [showDepositProcessingModal, toggleDepositProcessingModal] = useModal();

  const handleSetMax = () => {
    if (erc20Balance) {
      setDepositAmount(erc20Balance?.toString());
    }
  };
  const addGrayToDecimalInput = (str) => {
    const [wholeNumber, decimalPart] = str.split(".");
    return (
      <div className="flex">
        {wholeNumber ? <p className="text-white">{wholeNumber}</p> : null}.
        {decimalPart ? <p className="text-gray-syn4">{decimalPart}</p> : null}
      </div>
    );
  };

  const [currentTransaction, setCurrentTransaction] = useState(1);
  // Ordered steps
  const depositSteps: {
    title: string;
    info?: string;
  }[] = [
    {
      title: "Approve USDC",
      info: "Before depositing, you need to allow the protocol to use your USDC. You only need to do this once per syndicate.",
    },
    { title: "Complete deposit" },
  ];

  // check member account balance for deposit token.
  // we'll disable the continue button and style the input field accordingly
  // if the deposit amount is less than the account balance
  useEffect(() => {
    checkTokenBalance();
  }, [depositAmount]);

  // clear the input field on successful deposit or account switch
  useEffect(() => {
    if (successfulDeposit) {
      setDepositAmount("");
    }
  }, [successfulDeposit, account]);

  // check current member token allowance
  useEffect(() => {
    checkUnlimitedAllowanceSet();
  }, [syndicateContracts, account, depositTokenContract]);

  // check if approval is required for current amount.
  // if approval is not required, run the deposit function.
  // if not, set allowance to unlimited.
  useEffect(() => {
    if (depositAmount) {
      if (parseInt(currentMemberAllowance) > parseInt(depositAmount)) {
        // allowance already exists. Proceed with deposit
        setUnlimitedAllowanceSet(true);
        setCurrentTransaction(1);
      } else {
        // unlimited allowance needs to be set. Proceed with approval first.
        setUnlimitedAllowanceSet(false);
        setCurrentTransaction(0);
      }
    }
  }, [depositAmount, currentMemberAllowance]);

  /** ====== ADDITIONAL METHODS ======== */

  // method to check the allowance amount approved by a member.
  const checkUnlimitedAllowanceSet = async () => {
    if (depositTokenContract.methods && syndicateContracts && account) {
      try {
        const memberAllowanceAmount = await depositTokenContract.methods
          .allowance(
            account.toString(),
            syndicateContracts.DepositLogicContract._address,
          )
          .call({ from: account });

        const currentMemberAllowanceAmount = getWeiAmount(
          memberAllowanceAmount.toString(),
          depositTokenDecimals,
          false,
        );

        setCurrentMemberAllowance(currentMemberAllowanceAmount);
      } catch (error) {
        setUnlimitedAllowanceSet(false);
      }
    }
  };

  // method to handle approval of unlimited allowances by a member.
  const handleAllowanceApproval = async (event: any) => {
    event.preventDefault();
    setMetamaskConfirmPending(true);

    // update current transaction step
    setCurrentTransaction(1);

    // set amount to approve to unlimited tokens (2^256 - 1 )
    let amountToApprove =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    try {
      let gnosisTxHash;
      await new Promise((resolve, reject) => {
        depositTokenContract.methods
          .approve(
            syndicateContracts.DepositLogicContract._address,
            amountToApprove,
          )
          .send({ from: account })
          .on("transactionHash", (transactionHash) => {
            // user clicked on confirm
            // show loading state
            setSubmittingAllowanceApproval(true);
            setMetamaskConfirmPending(false);

            // Stop waiting if we are connected to gnosis safe via walletConnect
            if (web3._provider.wc?._peerMeta.name === "Gnosis Safe Multisig") {
              gnosisTxHash = transactionHash;
              resolve(transactionHash);
            }
          })
          .on("receipt", async (receipt) => {
            // sometimes the returned values from the attached event do not have
            // value key, hence the will be undefined.
            // call this function does the job of checking whether the allowance
            // was approved successfully or not.
            await checkUnlimitedAllowanceSet();
            setSubmittingAllowanceApproval(false);

            // Amplitude logger: Approve Allowance
            amplitudeLogger(APPROVE_DEPOSIT_ALLOWANCE, {
              flow: Flow.MBR_DEP,
              amount,
            });
            resolve(receipt);

            // update current transaction step
            setCurrentTransaction(2);
          })
          .on("error", (error) => {
            // user clicked reject.
            setSubmittingAllowanceApproval(false);
            setMetamaskConfirmPending(false);

            // Amplitude logger: Error Approve Allowance
            amplitudeLogger(ERROR_APPROVE_ALLOWANCE, {
              flow: Flow.MBR_DEP,
              amount,
              error,
            });
            reject(error);
          });
      });

      // fallback for gnosisSafe <> walletConnect
      if (gnosisTxHash) {
        await getGnosisTxnInfo(gnosisTxHash);
        await checkUnlimitedAllowanceSet();
        setSubmittingAllowanceApproval(false);

        // Amplitude logger: Approve Allowance
        amplitudeLogger(APPROVE_DEPOSIT_ALLOWANCE, {
          flow: Flow.MBR_DEP,
          amount,
        });
      }
    } catch (error) {
      setMetamaskConfirmPending(false);
      setSubmittingAllowanceApproval(false);
      setMetamaskConfirmPending(false);

      // Amplitude logger: Error Approve Allowance
      amplitudeLogger(ERROR_APPROVE_ALLOWANCE, {
        flow: Flow.MBR_DEP,
        amount,
        error,
      });
    }
  };

  // method to close the success modal as well as the success state
  // card.
  const closeSuccessModal = () => {
    setSuccessfulDeposit(false);
    setSubmitting(false);
    setMetamaskConfirmPending(false);
    if (showDepositProcessingModal) {
      toggleDepositProcessingModal();
    }
  };

  // method to handle copying of transaction links
  const handleOnCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  /** ===========METHODS END ================== */

  // set deposit button text based on current step.
  let depositButtonText;
  if (submittingAllowanceApproval && depositAmount) {
    depositButtonText = (
      <div className="flex justify-center items-center">
        <div className="mr-2">
          <Spinner
            width="w-4"
            height="h-4"
            margin="m-0"
            color="text-gray-syn4"
          />
        </div>
        <span>{`Approving ${depositTokenSymbol}`}</span>
      </div>
    );
  } else if (unlimitedAllowanceSet && depositAmount) {
    depositButtonText = "Complete deposit";
  } else if (!depositAmount) {
    depositButtonText = "Enter an amount to deposit";
  } else if (
    !unlimitedAllowanceSet &&
    !submittingAllowanceApproval &&
    depositAmount
  ) {
    depositButtonText = "Continue";
  }

  // we need to rebuild the tooltip for ownership share for this package.
  // See troubleshooting section here: https://www.npmjs.com/package/react-tooltip
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <ErrorBoundary>
      <div className="w-full mt-4 sm:mt-0 sticky top-44 mb-10">
        <FadeIn>
          {!syndicate ? (
            <div className="h-fit-content rounded-2xl p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0 w-full">
              <div className="h-fit-content rounded-3xl">
                <SkeletonLoader width="full" height="20" />
                <div className="mb-6">
                  <SkeletonLoader width="full" height="10" />
                </div>
                <div className="mb-4">
                  <SkeletonLoader width="full" height="12" />
                </div>
                <div className="mb-4">
                  <SkeletonLoader width="full" height="12" />
                </div>
                <div className="mb-4">
                  <SkeletonLoader width="full" height="12" />
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-2-half bg-gray-syn8`}>
              <StatusBadge
                distributing={syndicate?.distributing}
                depositsEnabled={syndicate?.depositsEnabled}
              />
              {((!submitting && !successfulDeposit) ||
                showDepositProcessingModal) && (
                <div className="h-fit-content rounded-2-half pt-6 px-8 pb-8">
                  <p className="h4 uppercase text-sm">
                    {parseInt(memberTotalDeposits) > 0
                      ? "deposit more"
                      : "join this syndicate"}
                  </p>
                  <div className="flex justify-between items-center mt-5 h-20">
                    <div className="flex items-center">
                      <AutoGrowInputField
                        value={depositAmount}
                        onChangeHandler={(value) => setDepositAmount(value)}
                        placeholder={"0"}
                        decimalSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        errorTextRed={insufficientBalance}
                      />
                      <div>
                        <button
                          className="ml-4 px-4 py-1.5 text-gray-syn4 bg-gray-syn7 rounded-full"
                          onClick={handleSetMax}
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center p-0 h-6">
                        <Image src={depositTokenLogo} height={24} width={24} />
                        <p className="ml-2 text-base">{depositTokenSymbol}</p>
                      </div>
                    </div>
                  </div>

                  {/* Error state for insufficientBalance */}
                  {insufficientBalance && (
                    <span className="text-red-semantic text-sm">
                      Insufficient balance.
                    </span>
                  )}

                  {/* Show token approval text  */}
                  {+currentMemberAllowance >= +depositAmount && (
                    <div className="flex items-center w-full justify-center mt-6">
                      <Image
                        src="/images/checkCircleGreen.svg"
                        height={16}
                        width={16}
                      />
                      <p className="ml-2 text-sm text-green">
                        {depositTokenSymbol} approved
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-center">
                    <button
                      className={`w-full rounded-lg text-base px-8 py-4 ${
                        !depositAmount ||
                        submittingAllowanceApproval ||
                        submitting ||
                        insufficientBalance ||
                        depositAmount === "0.00"
                          ? "bg-gray-syn6 text-gray-syn4"
                          : "bg-white text-black"
                      } `}
                      onClick={(e) => {
                        if (submittingAllowanceApproval) {
                          toggleDepositProcessingModal();
                          return;
                        }
                        if (!unlimitedAllowanceSet) {
                          handleAllowanceApproval(e);
                        } else {
                          investInSyndicate(depositAmount);
                        }
                        toggleDepositProcessingModal();
                      }}
                      disabled={
                        insufficientBalance ||
                        depositAmount === "0.00" ||
                        !depositAmount
                      }
                    >
                      {depositButtonText}
                    </button>
                  </div>
                  <div className="mt-4 flex w-full justify-center">
                    <p className="text-sm text-gray-syn5">
                      Your wallet balance:{" "}
                      {floatedNumberWithCommas(erc20Balance)}{" "}
                      {depositTokenSymbol}
                    </p>
                  </div>
                </div>
              )}
              {submitting && !showDepositProcessingModal && (
                <div className="h-fit-content rounded-2-half text-center">
                  <div className="pt-10 pb-8">
                    <Spinner width="w-16" height="h-16" margin="m-0" />
                  </div>
                  <div className="pb-6">
                    <span className="text-2xl">{`Depositing ${depositAmount} ${depositTokenSymbol}`}</span>
                  </div>
                  {transactionHash && (
                    <div className="pb-8 text-base flex justify-center items-center hover:opacity-80">
                      <EtherscanLink
                        etherscanInfo={transactionHash}
                        type="transaction"
                      />
                    </div>
                  )}
                </div>
              )}
              {successfulDeposit && !showDepositProcessingModal && (
                <div className="h-fit-content text-center relative">
                  <div className="absolute right-0 top-0">
                    <button
                      type="button"
                      className={`text-gray-syn7 rounded-md hover:text-gray-syn7 focus:outline-none p-2 w-12 h-12 focus:ring-0`}
                      onClick={() => closeSuccessModal()}
                    >
                      <span className="sr-only">Close</span>
                      <Image
                        src="/images/close-gray-5.svg"
                        width="12"
                        height="12"
                        alt="close"
                      />
                    </button>
                  </div>
                  <div className="pt-10 pb-8 flex justify-center items-center w-full">
                    <img
                      className="h-16 w-16"
                      src="/images/syndicateStatusIcons/checkCircleGreen.svg"
                      alt="checkmark"
                    />
                  </div>
                  <div className="pb-6 px-8">
                    <span className="text-base text-gray-syn4 text-center">{`You now have 1,000.00 synFWB, which represents a 2.34% ownership share of this syndicate.`}</span>
                  </div>
                  <CopyToClipboard
                    text={`${
                      isDev
                        ? "https://rinkeby.etherscan.io"
                        : "https://etherscan.io"
                    }/tx/${transactionHash}`}
                    onCopy={handleOnCopy}
                  >
                    <div className="relative pb-8  w-full">
                      <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
                        <span className="text-base mr-2 text-blue">
                          Copy transaction link
                        </span>
                        <Image
                          src="/images/actionIcons/copy-clipboard-blue.svg"
                          height={12}
                          width={12}
                        />
                      </div>
                      {copied && (
                        <div className="absolute w-full flex justify-center items-center">
                          <span className="text-xs text-gray-syn4 font-whyte-light">
                            Link copied
                          </span>
                        </div>
                      )}
                    </div>
                  </CopyToClipboard>
                </div>
              )}
            </div>
          )}
        </FadeIn>
      </div>

      <Modal
        {...{
          modalStyle: successfulDeposit ? ModalStyle.SUCCESS : ModalStyle.DARK,
          show: showDepositProcessingModal,
          closeModal: () => {
            toggleDepositProcessingModal();
          },
          customWidth: "w-100",
          customClassName: "pt-8 px-5 pb-5",
          showCloseButton: !successfulDeposit && !metamaskConfirmPending,
          outsideOnClick: !metamaskConfirmPending,
          showHeader: false,
        }}
      >
        {successfulDeposit ? (
          <div className="flex flex-col items-center">
            <img
              className="h-16 w-16"
              src="/images/syndicateStatusIcons/checkCircleGreen.svg"
              alt="checkmark"
            />
            <div className="pt-8">
              <span className="text-2xl">
                {`Deposited ${depositAmount} USDC`}
              </span>
            </div>
            <div className="pt-4 px-3 text-center">
              <span className="text-base text-gray-syn4">
                You now have 1,000.00 synFWB, which represents a 2.34% ownership
                share of this syndicate.
              </span>
            </div>
            <CopyToClipboard
              text={`${
                isDev ? "https://rinkeby.etherscan.io" : "https://etherscan.io"
              }/tx/${transactionHash}`}
              onCopy={handleOnCopy}
            >
              <div className="relative py-8 w-fit-content">
                <div className="flex justify-center items-center cursor-pointer hover:opacity-80">
                  <div className="mr-2">
                    <Image
                      src="/images/actionIcons/copy-clipboard-white.svg"
                      height={12}
                      width={12}
                    />
                  </div>
                  <div>
                    <span className="text-base">Copy transaction link</span>
                  </div>
                </div>
                {copied && (
                  <div className=" absolute w-full flex justify-center items-center">
                    <span className="text-xs font-whyte-light">
                      Link copied
                    </span>
                  </div>
                )}
              </div>
            </CopyToClipboard>

            <div className="px-5 w-full pb-5">
              <button
                className="w-full rounded-lg text-base px-8 py-4 bg-white text-black"
                onClick={() => {
                  closeSuccessModal();
                }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="uppercase h4 pl-5">confirm deposit</p>
            <div className="mt-8 rounded-lg border-gray-syn6 border relative">
              <div className="py-4 px-5 border-gray-syn6 border-b">
                <p className="text-base text-gray-syn4">Deposit amount</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-2xl">
                    <p>{addGrayToDecimalInput(depositAmount)}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center p-0 h-6">
                      <Image src={depositTokenLogo} height={24} width={24} />
                      <p className="ml-2 text-base">{depositTokenSymbol}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`absolute p-2 bg-gray-syn8 border-gray-syn6 border rounded-lg`}
                style={{ top: "calc(50% - 24px)", left: "calc(50% - 12px)" }}
              >
                <ArrowDown />
              </div>
              <div className="py-4 px-5">
                <div className="flex justify-between">
                  <p className="text-base text-gray-syn4">
                    Receiving club tokens
                  </p>
                  <div
                    className="flex justify-center items-center h-fit-content"
                    data-for="club-token-tooltip"
                    data-tip
                  >
                    <InfoIcon
                      src={"/images/deposit/info.svg"}
                      iconSize="h-3.5"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-2xl">
                    <p>{addGrayToDecimalInput(depositAmount)}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center p-0 h-6">
                      <Image
                        src={syndicateClubLogo as string}
                        height={24}
                        width={24}
                      />
                      <p className="ml-2 text-base">{syndicateClubSymbol}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-syn4">
                    = 2.34% ownership share
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              {depositSteps.map((step, stepIdx) => {
                const completedStep = currentTransaction > stepIdx + 1;
                const inactiveStep = currentTransaction < stepIdx + 1;
                return (
                  <div className="flex flex-col mb-5 relative" key={step.title}>
                    {stepIdx !== depositSteps?.length - 1 ? (
                      <div
                        className={`-ml-px absolute mt-0.5 top-3 left-2.5 w-0.5 h-20  ${
                          completedStep ? "bg-blue" : ""
                        }`}
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex group items-center">
                      <span
                        className="h-5 flex items-center"
                        aria-hidden="true"
                      >
                        {completedStep ? (
                          <span className="w-5 h-5 bg-blue rounded-full flex justify-center items-center">
                            <CheckIcon className="w-3 h-3 text-white" />
                          </span>
                        ) : (
                          <span
                            className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full ${
                              inactiveStep
                                ? "border-gray-dimmer"
                                : "border-blue"
                            }`}
                          />
                        )}
                      </span>
                      <span className="ml-4 min-w-0 flex flex-col">
                        <span
                          className={`text-base ${
                            inactiveStep ? "text-gray-dimmer" : "text-white"
                          } leading-7 font-light transition-all`}
                        >
                          {step.title}
                        </span>
                      </span>
                    </div>
                    {step.info ? (
                      <div className="ml-10 text-gray-dim text-sm">
                        <p>{step.info}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {metamaskConfirmPending ||
            submitting ||
            submittingAllowanceApproval ? (
              <div
                className={`mt-6 rounded-custom flex flex-col items-center ${
                  metamaskConfirmPending
                    ? "bg-blue-midnightExpress"
                    : "bg-gray-syn7"
                }`}
              >
                {metamaskConfirmPending ||
                submitting ||
                submittingAllowanceApproval ? (
                  <div className="py-6">
                    <Spinner width="w-10" height="h-10" margin="m-0" />
                  </div>
                ) : null}
                <span className="font-whyte leadning-normal pb-4">
                  {metamaskConfirmPending && !unlimitedAllowanceSet
                    ? `Approve ${depositTokenSymbol} from your wallet`
                    : null}

                  {metamaskConfirmPending && unlimitedAllowanceSet
                    ? "Confirm deposit from your wallet"
                    : null}
                  {submittingAllowanceApproval
                    ? `Approving ${depositTokenSymbol}`
                    : null}
                  {submitting
                    ? `Depositing ${depositAmount} ${depositTokenSymbol}`
                    : null}
                </span>
                <span className="leading-snug font-whyte text-sm text-gray-syn4 px-5 text-center pb-5">
                  {submittingAllowanceApproval || submitting
                    ? "This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait."
                    : null}
                  {metamaskConfirmPending && unlimitedAllowanceSet
                    ? "Deposits are irreversible."
                    : null}
                </span>
                {submitting && transactionHash ? (
                  <div className="pb-4 text-base flex justify-center items-center hover:opacity-80">
                    <EtherscanLink
                      etherscanInfo={transactionHash}
                      type="transaction"
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 mb-3 flex justify-center">
                <button
                  className="w-full rounded-lg text-base px-8 py-4 bg-white text-black"
                  onClick={(e) => {
                    if (unlimitedAllowanceSet) {
                      investInSyndicate(depositAmount);
                    } else {
                      handleAllowanceApproval(e);
                    }
                  }}
                >
                  {unlimitedAllowanceSet ? "Complete deposit" : "Continue"}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </ErrorBoundary>
  );
};

export default DepositSyndicate;
