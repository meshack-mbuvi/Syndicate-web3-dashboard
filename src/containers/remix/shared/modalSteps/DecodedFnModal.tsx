import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/state';
import { FunctionFragment } from 'ethers/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { B2 } from '../../../../components/typography';
import { EncodeURIComponent, getMultiValsString } from '../encodeParams';
import { CTAButton } from '@/components/CTAButton';
import { StepsOutline } from '@/components/stepsOutline';
import FragmentInputs from './FragmentInputs';
import { CustomModuleCallout } from '../CustomModuleCallout';
import EstimateGas from '@/components/EstimateGas';
import { ContractMapper } from '@/hooks/useGasDetails';
import { Callout } from '@/components/callout';
import SharedAbiFnModal from '../SharedAbiFnModal';
import { showWalletModal } from '@/state/wallet/actions';
interface DecodedFnModalProps {
  isSyndicateSupported: boolean;
  clickCallback: (
    abi: any,
    abiFunction: FunctionFragment | null,
    inputsValues: string[] | undefined,
    isLookupOnly?: boolean
  ) => void;
  contractAddress: string;
  name: string;
  isLoading: boolean;
  abi: any;
  moduleName: string;
  setFnFragment: (fn: FunctionFragment | null) => void;
  fnFragment: FunctionFragment;
  isLookupOnly: boolean;
  encodedFnParams?: string | string[];
}

const DecodedFnModal: React.FC<DecodedFnModalProps> = ({
  isSyndicateSupported,
  clickCallback,
  contractAddress,
  name,
  abi,
  moduleName,
  setFnFragment,
  fnFragment,
  isLookupOnly,
  encodedFnParams
}: DecodedFnModalProps) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork },
      showWalletModal: isShowingWalletModal
    }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const router = useRouter();

  const [fnParams, setFnParams] = useState<
    Record<string, string | number | boolean>
  >({});

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [hasReviewedCode, setHasReviewedCode] = useState<boolean>(false);
  const [showDecodedFnModal, setShowDecodedFnModal] = useState<boolean>(false);

  useEffect(() => {
    if (fnFragment) {
      setShowDecodedFnModal(true);
    }
    if (!fnFragment?.inputs) return;
    setFnParams({});
    fnFragment.inputs.forEach((inp) => {
      setFnParams((oldParams) => ({
        ...oldParams,
        [inp.name]: ''
      }));
    });
  }, [fnFragment]);

  useEffect(() => {
    let params: Array<unknown> = [];
    if (typeof encodedFnParams === 'string') {
      params = EncodeURIComponent.decode(encodedFnParams);
    } else if (Array.isArray(encodedFnParams)) {
      params = encodedFnParams.map((v) => EncodeURIComponent.decode(v));
    }

    if (params.length == fnFragment?.inputs?.length) {
      // assumes params are in order of fnFragment
      fnFragment.inputs.forEach((inp, i) => {
        setFnParams((oldParams) => ({
          ...oldParams,
          [inp.name]: Array.isArray(params[i])
            ? JSON.stringify(params[i])
            : params[i] + ''
        }));
      });
    }
  }, [encodedFnParams, fnFragment.inputs]);

  useEffect(() => {
    if (!isSyndicateSupported && activeStepIndex === 1 && !hasReviewedCode) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [activeStepIndex, hasReviewedCode, isSyndicateSupported]);

  const clearParams = (): void => {
    if (!router.isReady) return;
    const { chain, clubAddress, collectiveAddress } = router.query;
    void router.push({
      pathname: router.pathname,
      query: {
        ...(clubAddress && { clubAddress: clubAddress }),
        ...(collectiveAddress && { collectiveAddress: collectiveAddress }),
        chain: chain
      }
    });
  };

  const handleClose = (): void => {
    setActiveStepIndex(0);
    if (!isShowingWalletModal) {
      clearParams();
    }
  };

  const submitTxOrCall = (): void => {
    const valsString = getMultiValsString(fnParams);
    clickCallback(abi, fnFragment, valsString, isLookupOnly);
  };

  const handleStepAction = useCallback(() => {
    const handleConnectWallet = (): void => {
      dispatch(showWalletModal());
    };

    if (!account && activeStepIndex === 0) {
      handleConnectWallet();
    } else if (
      (!isSyndicateSupported && activeStepIndex < 3) ||
      (isSyndicateSupported && activeStepIndex < 2)
    ) {
      setTimeout(() => setActiveStepIndex(activeStepIndex + 1), 500);
    } else {
      submitTxOrCall();
    }
  }, [account, activeStepIndex, isSyndicateSupported, submitTxOrCall]);

  useEffect(() => {
    if (account && activeStepIndex === 0) {
      handleStepAction();
      setIsDisabled(false);
    } else if (!account) {
      setActiveStepIndex(0);
      setIsDisabled(false);
    }
  }, [account, activeStepIndex, handleStepAction]);

  return (
    <>
      <SharedAbiFnModal
        showSharedAbiFnModal={showDecodedFnModal}
        handleModalClose={handleClose}
        setFnFragment={setFnFragment}
        moduleName={moduleName}
        selectedFnFragment={fnFragment}
        selectedLookupOnly={isLookupOnly}
        isSyndicateSupported={isSyndicateSupported}
      >
        <>
          {activeStepIndex === 0 && (
            <div className="mt-4 pt-1">
              <B2 extraClasses="mb-8">
                {`${name}'${
                  name.charAt(name?.length - 1) == 's' ? '' : 's'
                } admin would like you to run a function from a ${
                  !isSyndicateSupported ? 'custom' : ''
                } module.`}
              </B2>

              {!isSyndicateSupported && <CustomModuleCallout />}
            </div>
          )}

          <>
            {activeStepIndex === 1 &&
              (isSyndicateSupported ? (
                <div className="pt-0.5"></div>
              ) : (
                <button
                  className="w-full pt-3"
                  onClick={(): void => setHasReviewedCode(true)}
                >
                  <a
                    href={`${activeNetwork?.blockExplorer?.baseUrl}/address/${contractAddress}#code`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center mt-10 w-full space-x-2 border-1 border-gray-syn5 rounded-full py-3 px-6 mb-7"
                  >
                    <Image
                      src={'/images/etherscan-white.svg'}
                      width={16}
                      height={16}
                      objectFit="contain"
                      color="white"
                    />
                    <B2 extraClasses="ml-2 font-semibold">
                      {'View full code on Etherscan'}
                    </B2>
                  </a>
                </button>
              ))}
            {((isSyndicateSupported && activeStepIndex === 2) ||
              (!isSyndicateSupported && activeStepIndex === 3)) && (
              <div className="pt-3">
                <FragmentInputs
                  fnFragment={fnFragment}
                  fnParams={fnParams}
                  setFnParams={setFnParams}
                />
              </div>
            )}
            <StepsOutline
              activeIndex={activeStepIndex}
              steps={[
                {
                  title: 'Connect wallet',
                  description:
                    'To use this custom module, connect the member wallet associated with this Collective.'
                },
                ...(!isSyndicateSupported
                  ? [
                      {
                        title: 'Review code',
                        description:
                          'Before continuing, please review this custom module’s smart contract code by viewing it on Etherscan.'
                      }
                    ]
                  : []),
                {
                  title: 'Input data and run function',
                  description: 'This custom module needs data inputs.'
                }
              ]}
              onlyShowActiveDescription={true}
              extraClasses="mt-6"
            />
            <div className="flex flex-col mt-10 -space-y-5">
              {!isLookupOnly && activeStepIndex > 1 && (
                <div className="mt-3">
                  <Callout
                    backgroundColor="bg-blue-midnightExpress"
                    backgroundOpacity="bg-opacity-100"
                    extraClasses="pt-3 pb-8 px-4 text-sm rounded-1.5lg"
                  >
                    <EstimateGas
                      contract={ContractMapper.RemixActiveModule}
                      withFiatCurrency={true}
                      remixDetails={{
                        inputValues: getMultiValsString(fnParams),
                        abiFunction: fnFragment,
                        remixContractAddress: contractAddress,
                        remixAbi: abi
                      }}
                      customClasses="bg-opacity-20 rounded-custom w-full flex cursor-default items-center"
                    />
                  </Callout>
                </div>
              )}

              <CTAButton
                onClick={handleStepAction}
                extraClasses={'w-full mb-0.5'}
                disabled={isDisabled}
              >
                {activeStepIndex === 0
                  ? 'Connect wallet'
                  : activeStepIndex === 1
                  ? 'Get started'
                  : activeStepIndex === 2 && !isSyndicateSupported
                  ? 'Continue'
                  : activeStepIndex === 3 ||
                    (activeStepIndex === 2 && isSyndicateSupported)
                  ? 'Run function'
                  : // : activeStepIndex === 3 // TODO [REMIX]: [PRO2-75] reformat after auth step outlines progressModal
                    // ? 'Running function'
                    'Done'}
              </CTAButton>
            </div>
          </>
        </>
      </SharedAbiFnModal>
    </>
  );
};

export default DecodedFnModal;
