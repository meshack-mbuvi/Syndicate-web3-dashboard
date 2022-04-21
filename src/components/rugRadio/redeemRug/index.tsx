import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  APPROVE_DEPOSIT_ALLOWANCE,
  ERROR_APPROVE_ALLOWANCE
} from '@/components/amplitude/eventNames';
import { CtaButton } from '@/components/CTAButton';
import ArrowDown from '@/components/icons/arrowDown';
import AutoGrowInputField from '@/components/inputs/autoGrowInput';
import Modal, { ModalStyle } from '@/components/modal';
import NumberTreatment from '@/components/NumberTreatment';
import { Spinner } from '@/components/shared/spinner';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import {
  floatedNumberWithCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import { CheckIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ERC20ABI from 'src/utils/abi/erc20';
import RugRadioIcon from '/public/images/rugRadio/rugRadioIcon.svg';

/**
 * This component contains the both the UI and link with the RUG deposit exchange
 * module used to redeem(convert) RUG to RDAO tokens
 */
const RedeemRug: React.FC = () => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { depositExchangeMintModule }
    },
    web3Reducer: {
      web3: { account, web3 }
    }
  } = useSelector((state: AppState) => state);
  const ratio = 1800; // i.e 1800 RUG = 1 RDAO

  const rugDaoTokenAddress = process.env.NEXT_PUBLIC_RDAO_TOKEN_ADDRESS;
  const rugTokenAddress = process.env.NEXT_PUBLIC_RUG_TOKEN;
  const depositExchangeModuleAddress =
    process.env.NEXT_PUBLIC_DEPOSIT_EXCHANGE_MODULE;

  const [amountToRedeem, setAmountToRedeem] = useState('');
  const [hasError, setHasError] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittingAllowanceApproval, setSubmittingAllowanceApproval] =
    useState(false);
  const [redeemSucceeded, setRedeemSucceeded] = useState(false);
  const [sufficientAllowanceSet, setSufficientAllowanceSet] = useState(false);
  const [redeemFailed, setRedeemFailed] = useState(false);
  const [metamaskConfirmPending, setMetamaskConfirmPending] =
    useState<boolean>(false);
  const [transactionRejected, setTransactionRejected] = useState(false);
  const [showRedeemProcessingModal, setShowRedeemProcessingModal] =
    useState(false);
  const [availableTokens, setAvailableTokens] = useState(0);
  const [tokenSwitched, setTokenSwitched] = useState(false);
  const [maxRDao, setMaxRDao] = useState(+availableTokens / ratio);
  const [rDaoToRedeem, setRDaoToRedeem] = useState('');
  const [transactionFailed, setTransactionFailed] = useState(false);
  const [maximumWithdrawable, setMaximumWithdrawable] = useState(0);

  const [redeemError, setRedeemError] = useState('');

  const [disableMaxButton, setDisableMaxButton] = useState(false);

  const rugRadioContract = new web3.eth.Contract(
    ERC20ABI as AbiItem[],
    rugTokenAddress
  );

  const rugTokensToRedeem = tokenSwitched
    ? +amountToRedeem * ratio
    : amountToRedeem;

  useEffect(() => {
    if (
      Math.floor(+amountToRedeem) == Math.floor(maximumWithdrawable) ||
      Math.abs(+maximumWithdrawable - +amountToRedeem) < 0.009
    ) {
      setDisableMaxButton(true);
    } else {
      setDisableMaxButton(false);
    }
    checkCurrentAllowance();
    availableRugTokens();
  }, [amountToRedeem, maxRDao, rDaoToRedeem]);

  useEffect(() => {
    setMaximumWithdrawable(
      tokenSwitched ? +availableTokens / ratio : availableTokens
    );

    return () => {
      setMaximumWithdrawable(0);
    };
  }, [tokenSwitched, availableTokens]);

  const availableRugTokens = async () => {
    try {
      const tokens = await rugRadioContract?.methods.balanceOf(account).call();
      const decimals = await rugRadioContract?.methods.decimals().call();
      setAvailableTokens(getWeiAmount(tokens, decimals, false));
    } catch (error) {
      setAvailableTokens(0);
    }
  };

  const checkCurrentAllowance = useCallback(async () => {
    try {
      const tokenAllowance = await rugRadioContract?.methods
        .allowance(account.toString(), depositExchangeModuleAddress)
        .call({ from: account });

      const currentAllowance = getWeiAmount(
        tokenAllowance.toString(),
        18,
        false
      );

      if (+rugTokensToRedeem <= +currentAllowance) {
        setSufficientAllowanceSet(true);
        setCurrentTransaction(2);
      } else {
        setSufficientAllowanceSet(false);
        setCurrentTransaction(1);
      }
    } catch (error) {
      setSufficientAllowanceSet(false);
    }
  }, [amountToRedeem, rugTokensToRedeem]);

  useEffect(() => {
    if (
      (tokenSwitched && +amountToRedeem > +maxRDao) ||
      (!tokenSwitched && +amountToRedeem > +availableTokens)
    ) {
      setHasError(true);
      setRedeemError(
        `The amount you entered is too high. You can redeem upto a maximum of ${
          tokenSwitched
            ? `${floatedNumberWithCommas(maxRDao)} RDAO`
            : `${floatedNumberWithCommas(availableTokens)} RUG`
        }`
      );
    } else {
      setHasError(false);
      setRedeemError('');
    }

    setMaxRDao(availableTokens / ratio);

    return () => {
      setHasError(false);
    };
  }, [amountToRedeem, availableTokens, rDaoToRedeem, maxRDao, tokenSwitched]);

  // This is displayed on the card to show user the approximate amount they
  // are redeeming either in RDAOs or in RUG.
  useEffect(() => {
    if (!tokenSwitched) {
      setRDaoToRedeem(`${+amountToRedeem / ratio}`);
    } else {
      setRDaoToRedeem(`${+amountToRedeem * ratio}`);
    }
  }, [tokenSwitched, amountToRedeem]);

  const handleSetMax = () => {
    const maximumWithdrawable = tokenSwitched
      ? +availableTokens / ratio
      : availableTokens;

    setAmountToRedeem(maximumWithdrawable.toString());
  };

  const handleOnchange = (value) => {
    setAmountToRedeem(value);
  };

  const onTxConfirm = () => {
    setMetamaskConfirmPending(false);
    setSubmitting(true);
  };

  const onTxReceipt = () => {
    setSubmitting(false);
    setRedeemSucceeded(true);
    setTransactionRejected(false);
    setSufficientAllowanceSet(false);
  };

  const onTxFail = (error?) => {
    const { code } = error;

    if (code == 4001) {
      setTransactionRejected(true);
    } else {
      setTransactionRejected(false);
      setRedeemFailed(true);
    }
    setMetamaskConfirmPending(false);
    setSubmitting(false);
  };

  // method to handle approval of allowances by a member.
  const handleAllowanceApproval = async (event: any) => {
    event.preventDefault();
    setMetamaskConfirmPending(true);
    setTransactionRejected(false);

    // update current transaction step
    setCurrentTransaction(1);

    // set amount to approve.
    const amountToApprove = getWeiAmount(
      rugTokensToRedeem.toString(),
      18,
      true
    );

    try {
      let gnosisTxHash;

      await new Promise((resolve, reject) => {
        const rugRadioContract = new web3.eth.Contract(
          ERC20ABI as AbiItem[],
          rugTokenAddress
        );
        rugRadioContract.methods
          .approve(depositExchangeModuleAddress, amountToApprove)
          .send({ from: account })
          .on('transactionHash', (transactionHash) => {
            // user clicked on confirm
            // show loading state
            setSubmittingAllowanceApproval(true);
            setMetamaskConfirmPending(false);

            // Stop waiting if we are connected to gnosis safe via walletConnect
            if (web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig') {
              gnosisTxHash = transactionHash;
              resolve(transactionHash);
            }
          })
          .on('receipt', async (receipt) => {
            await checkCurrentAllowance();
            setSubmittingAllowanceApproval(false);

            // Amplitude logger: Approve Allowance
            amplitudeLogger(APPROVE_DEPOSIT_ALLOWANCE, {
              flow: Flow.MBR_DEP,
              amount: amountToApprove
            });
            resolve(receipt);

            // update current transaction step
            setCurrentTransaction(2);
          })
          .on('error', (error) => {
            // user clicked reject.
            if (error?.code === 4001) {
              setTransactionRejected(true);
              setSubmittingAllowanceApproval(false);
              setMetamaskConfirmPending(false);
            } else {
              setTransactionFailed(true);
              setSubmittingAllowanceApproval(false);
              setMetamaskConfirmPending(false);
            }

            // Amplitude logger: Error Approve Allowance
            amplitudeLogger(ERROR_APPROVE_ALLOWANCE, {
              flow: Flow.MBR_DEP,
              amount: amountToApprove,
              error
            });
            reject(error);
          });
      });

      // fallback for gnosisSafe <> walletConnect
      if (gnosisTxHash) {
        // await getGnosisTxnInfo(gnosisTxHash);
        // await checkCurrentMemberAllowance();
        setSubmittingAllowanceApproval(false);

        // Amplitude logger: Approve Allowance
        amplitudeLogger(APPROVE_DEPOSIT_ALLOWANCE, {
          flow: Flow.MBR_DEP,
          amount: amountToApprove
        });
      }
    } catch (error) {
      setMetamaskConfirmPending(false);
      setSubmittingAllowanceApproval(false);
      setMetamaskConfirmPending(false);

      // Amplitude logger: Error Approve Allowance
      amplitudeLogger(ERROR_APPROVE_ALLOWANCE, {
        flow: Flow.MBR_DEP,
        amount: amountToApprove,
        error
      });
    }
  };

  const handleRedeem = async () => {
    setMetamaskConfirmPending(true);
    await depositExchangeMintModule.mint(
      rugDaoTokenAddress,
      getWeiAmount(rugTokensToRedeem.toString(), 18, true),
      account,
      onTxConfirm,
      onTxReceipt,
      onTxFail,
      setTransactionHash
    );
  };

  const handleCloseSuccessModal = () => {
    setShowRedeemProcessingModal(false);
    setRedeemSucceeded(false);
    setSubmitting(false);
    setMetamaskConfirmPending(false);
    setRedeemFailed(false);
    setTransactionRejected(false);
    // clear deposit amount
    setAmountToRedeem('');
  };

  const [currentTransaction, setCurrentTransaction] = useState(1);
  // Ordered steps
  const redeemSteps: {
    title: string;
    info?: string;
  }[] = [
    {
      title: 'Approve RUG',
      info: 'Before redeeming, you need to allow the protocol to use your RUG.'
    },
    {
      title: 'Complete redemption',
      info: 'Redeeming RUG for RDAO cannot be reversed.'
    }
  ];

  const closeSuccessModal = () => {
    setShowRedeemProcessingModal(false);
    setAmountToRedeem('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-5 h-20 flex-wrap">
        <div className="flex items-center">
          <AutoGrowInputField
            value={amountToRedeem.toString()}
            onChangeHandler={handleOnchange}
            placeholder={'0'}
            decimalSeparator="."
            hasError={hasError}
            decimalScale={4}
          />
          <div>
            <button
              className={`px-4 py-1.5 text-gray-syn4 bg-gray-syn7 rounded-full ${
                disableMaxButton ? 'cursor-not-allowed' : ''
              }`}
              onClick={handleSetMax}
              disabled={disableMaxButton}
            >
              Max
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center p-0 h-6 ">
            <Image src={RugRadioIcon} height={24} width={24} />
            <p className="ml-2 text-base">{tokenSwitched ? 'RDAO' : 'Rug'}</p>
            <button
              className="ml-2 cursor-pointer flex items-center"
              onClick={() => setTokenSwitched(!tokenSwitched)}
            >
              <Image src="/images/upDownArrow.svg" height={16} width={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-gray-syn5">
        {tokenSwitched ? (
          <>
            <span>
              ~ <NumberTreatment numberValue={`${rDaoToRedeem}`} /> RUG
            </span>
            <span>1 RDAO : 1,800 RUG</span>
          </>
        ) : (
          <>
            <span>
              ~ <NumberTreatment numberValue={rDaoToRedeem.toString()} /> RDAO
            </span>
            <span>1,800 RUG : 1 RDAO</span>
          </>
        )}
      </div>

      {redeemError && (
        <div className="font-whyte text-sm text-red-error mt-4">
          {redeemError}
        </div>
      )}

      <div className="mt-6">
        <CtaButton
          onClick={() => {
            setRedeemSucceeded(false);
            setShowRedeemProcessingModal(true);
          }}
          greenCta={false}
          disabled={+amountToRedeem == 0 || hasError}
        >
          {+amountToRedeem == 0 ? 'Enter an amount to redeem' : 'Continue'}
        </CtaButton>
      </div>

      <div className="text-gray-syn5 text-sm mt-4 flex justify-center">
        Wallet balance: {floatedNumberWithCommas(availableTokens)} RUG
      </div>

      {/* confirm redeem modal */}
      <Modal
        {...{
          modalStyle: ModalStyle.DARK,
          show: showRedeemProcessingModal,
          closeModal: () => handleCloseSuccessModal(),
          customWidth: 'w-11/12 sm:w-100',
          customClassName: 'pt-8 px-5 pb-5',
          showCloseButton: true,
          outsideOnClick: !metamaskConfirmPending,
          showHeader: false
        }}
      >
        {redeemSucceeded ? (
          <div className="flex flex-col items-center">
            <img
              className="h-16 w-16"
              src="/images/syndicateStatusIcons/checkCircleGreen.svg"
              alt="checkmark"
            />
            <div className="pt-8">
              <span className="text-2xl">RUG redeemed for RDAO</span>
            </div>
            <div className="pt-4 px-3 text-center">
              <span className="text-base text-gray-syn4">
                {`You just redeemed ${floatedNumberWithCommas(
                  rugTokensToRedeem
                )} RUG for ${numberWithCommas(
                  (+rugTokensToRedeem / ratio).toFixed(4)
                )} RDAO. It's in your wallet.`}{' '}
              </span>
            </div>

            <div className="px-5 w-full pb-5 mt-6">
              <button
                className="w-full rounded-lg text-base px-8 py-4 bg-white text-black"
                onClick={() => {
                  closeSuccessModal();
                }}
              >
                Done
              </button>
            </div>

            <div className="pb-4 text-base flex justify-center items-center hover:opacity-80">
              <BlockExplorerLink
                resourceId={transactionHash}
                resource="transaction"
                suffix="transaction"
              />
            </div>
          </div>
        ) : (
          <div>
            <p className="uppercase h4 pl-5">confirm redemption</p>
            <div className="mt-8 rounded-lg border-gray-syn6 border relative">
              <div className="py-4 px-5 border-gray-syn6 border-b">
                <p className="text-base text-gray-syn4">Amount to redeem</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-2xl">
                    <p>
                      <NumberTreatment
                        numberValue={rugTokensToRedeem.toString()}
                      />
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center p-0 h-6">
                      <Image src={RugRadioIcon} height={24} width={24} />
                      <p className="ml-2 text-base">RUG</p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`absolute p-2 bg-gray-syn8 border-gray-syn6 border rounded-lg`}
                style={{ top: 'calc(50% - 16px)', left: 'calc(50% - 12px)' }}
              >
                <ArrowDown />
              </div>
              <div className="py-4 px-5">
                <div className="flex justify-between">
                  <p className="text-base text-gray-syn4">
                    Receiving RDAO tokens
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-2xl">
                    <p>
                      <NumberTreatment
                        numberValue={`${+rugTokensToRedeem / ratio}`}
                      />
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center p-0 h-6">
                      <Image
                        src={RugRadioIcon as string}
                        height={24}
                        width={24}
                      />
                      <p className="ml-2 text-base">RDAO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Show transaction steps if this is user's first deposit */}
            <div className="mt-8 px-5">
              {redeemSteps.map((step, stepIdx) => {
                const completedStep = currentTransaction > stepIdx + 1;
                const inactiveStep = currentTransaction < stepIdx + 1;
                return (
                  <div className="flex flex-col mb-5 relative" key={step.title}>
                    {stepIdx !== redeemSteps?.length - 1 ? (
                      <div
                        className={`-ml-px absolute mt-0.5 top-5 left-2.5 w-0.5 h-18  ${
                          completedStep ? 'bg-blue' : 'bg-gray-syn6'
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
                              inactiveStep ? 'border-gray-syn6' : 'border-blue'
                            }`}
                          />
                        )}
                      </span>
                      <span className="ml-4 min-w-0 flex flex-col">
                        <span
                          className={`text-base font-normal ${'text-white'} leading-7 font-light transition-all`}
                        >
                          {step.title}
                        </span>
                      </span>
                    </div>
                    {step.info ? (
                      <div className="ml-9 text-gray-syn4 text-sm">
                        <p className="text-gray-syn4">{step.info}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {(metamaskConfirmPending ||
              submitting ||
              submittingAllowanceApproval) &&
            !redeemSucceeded ? (
              <div
                className={`mt-6 rounded-custom flex flex-col items-center ${
                  metamaskConfirmPending
                    ? 'bg-blue-midnightExpress'
                    : 'bg-gray-syn7'
                }`}
              >
                {metamaskConfirmPending ||
                submitting ||
                submittingAllowanceApproval ? (
                  <div className="py-6">
                    <Spinner width="w-10" height="h-10" margin="m-0" />
                  </div>
                ) : null}

                <span className="font-whyte leading-normal pb-2">
                  {metamaskConfirmPending && !sufficientAllowanceSet
                    ? `Approve RUG from your wallet`
                    : null}

                  {metamaskConfirmPending && sufficientAllowanceSet
                    ? 'Confirm redemption from your wallet'
                    : null}
                  {submittingAllowanceApproval
                    ? `Approving RUG`
                    : submitting
                    ? `Redeeming ${floatedNumberWithCommas(
                        rugTokensToRedeem
                      )} RUG`
                    : null}
                </span>

                <span
                  className={`leading-snug font-whyte text-sm  text-gray-syn4 px-5 text-center pb-5`}
                >
                  {(submittingAllowanceApproval || submitting) &&
                    'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. You can safely leave this page while you wait.'}
                </span>
                {submitting && transactionHash ? (
                  <div className="pb-4 text-base flex justify-center items-center hover:opacity-80">
                    <BlockExplorerLink
                      resourceId={transactionHash}
                      resource="transaction"
                      suffix="transaction"
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div
                className={`${
                  redeemFailed || transactionRejected || transactionFailed
                    ? 'bg-red-error'
                    : ''
                }   rounded-md bg-opacity-10 mt-4 py-6 flex flex-col justify-center px-5`}
              >
                {redeemFailed ||
                  transactionRejected ||
                  (transactionFailed && (
                    <>
                      <div className="flex justify-center items-center w-full">
                        <Image
                          width={48}
                          height={48}
                          src={
                            '/images/syndicateStatusIcons/transactionFailed.svg'
                          }
                          alt="failed"
                        />
                      </div>
                      <div className={`mt-4 mb-6 text-center`}>
                        <span className="text-base">{`${
                          redeemFailed
                            ? 'Redemption failed'
                            : `Transaction ${
                                transactionRejected ? 'rejected' : 'failed'
                              }`
                        }`}</span>
                      </div>
                    </>
                  ))}
                <button
                  className="w-full rounded-lg text-base py-4 bg-white text-black"
                  onClick={(e) => {
                    if (sufficientAllowanceSet) {
                      handleRedeem();
                    } else {
                      handleAllowanceApproval(e);
                    }
                    setTransactionRejected(false);
                    setRedeemFailed(false);
                  }}
                >
                  {redeemFailed || transactionRejected || transactionFailed
                    ? 'Try again'
                    : sufficientAllowanceSet
                    ? 'Complete redemption'
                    : 'Continue'}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RedeemRug;
