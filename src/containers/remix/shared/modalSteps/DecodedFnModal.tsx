import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { FunctionFragment } from 'ethers/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { B2, M2 } from '../../../../components/typography';
import { ProgressState } from '@/components/progressCard';
import { EncodeURIComponent, getMultiValsString } from '../encodeParams';
import { CTAButton } from '@/components/CTAButton';
// import { showWalletModal } from '@/state/wallet/actions';
import SharedAbiFnModal from '../SharedAbiFnModal';
import { StepsOutline } from '@/components/stepsOutline';
import FragmentInputs from './FragmentInputs';
import { CustomModuleCallout } from '../CustomModuleCallout';
import { ProgressModal } from '@/components/progressModal';
import { getInputs } from '@/utils/remix';
import EstimateGas from '@/components/EstimateGas';
import { ContractMapper } from '@/hooks/useGasDetails';
import { Callout } from '@/components/callout';

interface DecodedFnModalProps {
  showDecodedFnModal: boolean;
  isSyndicateSupported: boolean;
  handleModalClose: () => void;
  clearResponse: () => void;
  clickCallback: (
    abi: any,
    abiFunction: FunctionFragment | undefined,
    inputsValues: string[] | undefined,
    lookupOnly?: boolean
  ) => void;
  contractAddress: string;
  name: string;
  chainId: number;
  abi: any;
  moduleName: string;
  funcABI: FunctionFragment;
  lookupOnly: boolean;
  txnProgress?: {
    progressStatus: ProgressState;
    progressTitle?: string;
    progressDescription?: string;
    txnHash?: string;
  };
  encodedFnParams?: string | string[];
  response?: any;
}

const DecodedFnModal: React.FC<DecodedFnModalProps> = ({
  showDecodedFnModal,
  isSyndicateSupported,
  handleModalClose,
  clearResponse,
  clickCallback,
  contractAddress,
  name,
  abi,
  moduleName,
  funcABI,
  lookupOnly,
  encodedFnParams,
  response,
  txnProgress
}: DecodedFnModalProps) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  // const dispatch = useDispatch();

  const [fnParams, setFnParams] = useState<
    Record<string, string | number | boolean>
  >({});

  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [hasReviewedCode, setHasReviewedCode] = useState<boolean>(false);

  useEffect(() => {
    if (!funcABI?.inputs) return;
    setFnParams({});
    funcABI.inputs.forEach((inp) => {
      setFnParams((oldParams) => ({
        ...oldParams,
        [inp.name]: ''
      }));
    });
  }, [funcABI]);

  useEffect(() => {
    let params: string[] = [];
    if (typeof encodedFnParams == 'string') {
      params = EncodeURIComponent.decode(encodedFnParams);
    } else if (Array.isArray(encodedFnParams)) {
      params = EncodeURIComponent.decode(encodedFnParams.toString());
    }

    if (params.length == funcABI?.inputs?.length) {
      // assumes params are in order of funcAbi
      funcABI.inputs.forEach((inp, i) => {
        setFnParams((oldParams) => ({
          ...oldParams,
          [inp.name]: params[i]
        }));
      });
    }
  }, [encodedFnParams]);

  const handleClose = () => {
    setActiveStepIndex(-1);
    handleModalClose();
  };

  useEffect(() => {
    if (activeStepIndex === 1 && !hasReviewedCode) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [activeStepIndex, hasReviewedCode]);

  const submitTxOrCall = () => {
    const valsString = getMultiValsString(fnParams);
    clickCallback(abi, funcABI, valsString, lookupOnly);
  };

  // const handleConnectWallet = (e: any) => {
  //   e.preventDefault();
  //   dispatch(showWalletModal());
  // };

  const handleStepAction = () => {
    if (activeStepIndex < 3) {
      setTimeout(() => setActiveStepIndex(activeStepIndex + 1), 500);
    } else {
      submitTxOrCall();
    }
  };

  useEffect(() => {
    if (account && activeStepIndex === -1) {
      handleStepAction();
      setIsDisabled(false);
    } else if (!account) {
      setActiveStepIndex(0);
      setIsDisabled(true);
    }
  }, [account]);

  // check if all params have a value since we cannot call estimate
  // gas on the func with a required argument missing.
  const paramsAvailable =
    Object.keys(fnParams).filter((key) => Boolean(fnParams[key])).length ===
    funcABI?.inputs.length;

  return (
    <>
      {txnProgress?.progressStatus === ProgressState.FAILURE ||
      txnProgress?.progressStatus === ProgressState.SUCCESS ? (
        <ProgressModal
          isVisible={true}
          title={''}
          description={
            <span>
              The function
              <M2 extraClasses="text-gray-syn3 mt-3 mb-4">
                <span className="bg-gray-syn7 pb-1 px-2 text-center rounded">
                  {`${funcABI.name}: ${getInputs(funcABI)}`}
                </span>
              </M2>
              was called successfully.
            </span>
          }
          buttonLabel={'Done'}
          buttonOnClick={handleModalClose}
          buttonFullWidth={false}
          state={txnProgress?.progressStatus}
        />
      ) : (
        <SharedAbiFnModal
          showSharedAbiFnModal={showDecodedFnModal}
          handleModalClose={handleClose}
          moduleName={moduleName}
          selectedFnFragment={funcABI}
          selectedLookupOnly={lookupOnly}
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
              {activeStepIndex === 1 && (
                <button
                  className="w-full"
                  onClick={() => setHasReviewedCode(true)}
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
              )}
              {activeStepIndex === 2 && (
                <>
                  <FragmentInputs
                    clearResponse={clearResponse}
                    funcABI={funcABI}
                    fnParams={fnParams}
                    setFnParams={setFnParams}
                  />
                  {response && <p>{`res: ${response}`}</p>}
                </>
              )}
              {activeStepIndex > 2 && (
                <>{response && <p>{`res: ${response}`}</p>}</>
              )}

              <StepsOutline
                activeIndex={activeStepIndex}
                steps={[
                  {
                    title: 'Connect wallet',
                    description:
                      'To use this custom module, connect the member wallet associated with this Collective.'
                  },
                  {
                    title: 'Review code',
                    description:
                      'Before continuing, please review this custom module’s smart contract code by viewing it on Etherscan.'
                  },
                  {
                    title: 'Input data and run function',
                    description: 'This custom module needs data inputs.'
                  }
                ]}
                alwaysShowDescriptions={false}
                extraClasses="mt-6"
              />
              <div className="flex flex-col mt-6 -space-y-5">
                {paramsAvailable && activeStepIndex > 1 ? (
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
                          abiFunction: funcABI,
                          remixContractAddress: contractAddress,
                          remixAbi: abi
                        }}
                        customClasses="bg-opacity-20 rounded-custom w-full flex cursor-default items-center"
                      />
                    </Callout>
                  </div>
                ) : null}

                <CTAButton
                  onClick={handleStepAction}
                  extraClasses={'w-full'}
                  disabled={isDisabled}
                >
                  {activeStepIndex === -1
                    ? 'Connect wallet'
                    : activeStepIndex === 0
                    ? 'Get started'
                    : activeStepIndex === 1
                    ? 'Continue'
                    : activeStepIndex === 2
                    ? 'Run function'
                    : activeStepIndex === 3
                    ? 'Running function'
                    : 'Done'}
                </CTAButton>
              </div>
            </>
          </>
        </SharedAbiFnModal>
      )}
    </>
  );
};

export default DecodedFnModal;
