import { Callout } from '@/components/callout';
import { CTAButton } from '@/components/CTAButton';
import EstimateGas from '@/components/EstimateGas';
import { B1, B2, B3, B4, E2 } from '@/components/typography';
import { ContractMapper } from '@/hooks/useGasDetails';
import { AppState } from '@/state';
import { getInputs, sortAbiFunction } from '@/utils/remix';
import { FunctionFragment } from 'ethers/lib/utils';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMultiValsString } from './encodeParams';
import AbiFnUI from './modalSteps/AbiFnUI';
import FragmentInputs from './modalSteps/FragmentInputs';
import RemixLink from './RemixLink';
import SharedAbiFnModal from './SharedAbiFnModal';
import TxnEncodeUrl from './TxnEncodeUrl';

export interface AbiUIProps {
  instance: {
    address: string;
    chainId: number;
    name: string;
    abi: AbiItem[];
    isSyndicateSupported: boolean;
    isActive: boolean;
    description?: string;
    isUnverified?: boolean;
    invalidResponse?: string;
  };
  setFnFragment: (fn: FunctionFragment | null) => void;
  fnFragment: FunctionFragment | null;
  setFnLookupOnly: (isLookup: boolean) => void;
  isLookupOnly: boolean;
  clickCallback: (
    abi: any,
    abiFunction: FunctionFragment | null,
    inputsValues: string[] | undefined,
    isLookupOnly?: boolean
  ) => void;
  selectedFnFragment?: FunctionFragment | null;
  selectedLookupOnly?: boolean;
}

const AbiUI: React.FC<AbiUIProps> = ({
  instance,
  setFnFragment,
  fnFragment,
  setFnLookupOnly,
  isLookupOnly,
  clickCallback,
  selectedFnFragment,
  selectedLookupOnly
}: AbiUIProps) => {
  const {
    web3Reducer: {
      web3: { activeNetwork },
      showWalletModal: isShowingWalletModal
    }
  } = useSelector((state: AppState) => state);
  const [abiFns, setAbiFns] = useState<FunctionFragment[]>();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [showFnModal, setShowFnModal] = useState(false);

  const {
    abi,
    address,
    name,
    chainId,
    isSyndicateSupported,
    isActive,
    description,
    isUnverified,
    invalidResponse
  } = instance;

  const [fnParams, setFnParams] = useState<
    Record<string, string | number | boolean>
  >({});

  useEffect(() => {
    if (abi) {
      setAbiFns(sortAbiFunction(abi) as FunctionFragment[]);
    }
  }, [abi]);

  const handleClose = useCallback(() => {
    if (!isShowingWalletModal) {
      setActiveStepIndex(0);
      setFnParams({});
      setFnFragment(null);
      setShowFnModal(false);
    }
  }, [isShowingWalletModal, setFnFragment]);

  useEffect(() => {
    if (activeStepIndex > 1) {
      setTimeout(() => handleClose(), 500);
    }
  }, [activeStepIndex, handleClose]);

  useEffect(() => {
    if (selectedFnFragment) {
      setShowFnModal(true);
    }
    if (!selectedFnFragment?.inputs) return;
    setFnParams({});
    selectedFnFragment.inputs.forEach((inp) => {
      setFnParams((oldParams) => ({
        ...oldParams,
        [inp.name]: ''
      }));
    });
  }, [selectedFnFragment]);

  const submitTxOrCall = (): void => {
    const valsString = getMultiValsString(fnParams);
    clickCallback(abi, fnFragment, valsString, isLookupOnly);
  };

  return (
    <>
      <div
        id={`instance${address}`}
        className={`w-full max-w-355 ${
          !isUnverified && !invalidResponse ? '' : 'hidden'
        }`}
      >
        <button
          onClick={(): void => setShowFnModal(!showFnModal)}
          className={`${
            isActive ? 'bg-gray-syn8' : 'border-1 border-gray-syn7'
          } rounded-2.5xl px-8 py-6 mb-5 w-full`}
        >
          <div className="flex flex-col items-start">
            {isActive && (
              <div
                className="px-2 py-1 rounded-3xl mb-2 w-14"
                style={{
                  background: `linear-gradient(89.98deg, #4176FF 0.01%, #85FFD3 98.21%)`
                }}
              >
                <B4 extraClasses="text-black">Active</B4>
              </div>
            )}
            <B1 extraClasses="mb-2">{name}</B1>
            {description && (
              <B3 extraClasses="text-gray-syn3 mb-5 text-left">
                {description}
              </B3>
            )}
            <E2 extraClasses="font-normal text-gray-syn4">
              {(abiFns || []).filter((fn) => fn?.type === 'function')?.length}{' '}
              functions
            </E2>
          </div>
        </button>
        <SharedAbiFnModal
          showSharedAbiFnModal={showFnModal}
          showBackButton={selectedFnFragment ? true : false}
          handleModalClose={handleClose}
          moduleName={name}
          selectedFnFragment={selectedFnFragment}
          selectedLookupOnly={selectedLookupOnly}
          isSyndicateSupported={isSyndicateSupported}
          setFnFragment={setFnFragment}
        >
          {!selectedFnFragment ? (
            <>
              <div className="mb-10">
                {description && (
                  <B2 extraClasses="mb-4 text-gray-syn3">{description}</B2>
                )}
                {/* links */}
                <div className="flex items-center">
                  <RemixLink
                    text="View docs"
                    link="https://guide.syndicate.io/en/developer-platform/remix-mode"
                    extraClasses="mr-6"
                  />
                  <RemixLink
                    text="View code on Etherscan"
                    link={`${activeNetwork?.blockExplorer?.baseUrl}/address/${address}#code`}
                    extraClasses="ml-0.5"
                  />
                </div>
              </div>
              {abiFns &&
                abiFns.map((funcABI, index) => {
                  if (funcABI.type !== 'function') return null;
                  const isConstant =
                    funcABI.constant !== undefined ? funcABI.constant : false;
                  const isLookupOnly =
                    funcABI.stateMutability === 'view' ||
                    funcABI.stateMutability === 'pure' ||
                    isConstant;
                  const inputs = getInputs(funcABI);

                  return (
                    <div key={index} className={`mt-2`}>
                      <AbiFnUI
                        funcABI={funcABI}
                        inputs={inputs}
                        isLookupOnly={isLookupOnly}
                        setFnFragment={setFnFragment}
                        setFnLookupOnly={setFnLookupOnly}
                        key={index}
                      />
                    </div>
                  );
                })}
            </>
          ) : (
            <div className="pt-3">
              <FragmentInputs
                fnFragment={selectedFnFragment}
                fnParams={fnParams}
                setFnParams={setFnParams}
              />

              {!isLookupOnly && (
                <div className="mt-6">
                  <Callout
                    backgroundColor="bg-blue-midnightExpress"
                    backgroundOpacity="bg-opacity-100"
                    extraClasses="pt-3 pb-4 px-4 text-sm rounded-1.5lg"
                  >
                    <EstimateGas
                      contract={ContractMapper.RemixActiveModule}
                      withFiatCurrency={true}
                      remixDetails={{
                        inputValues: getMultiValsString(fnParams),
                        abiFunction: fnFragment,
                        remixContractAddress: address,
                        remixAbi: abi
                      }}
                      customClasses="bg-opacity-20 rounded-custom w-full flex cursor-default items-center"
                    />
                  </Callout>
                </div>
              )}
              <CTAButton
                onClick={submitTxOrCall}
                extraClasses={`w-full ${isLookupOnly ? 'mt-5' : ''}`}
              >
                {'Run function'}
              </CTAButton>

              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-syn6"></div>
                <E2 extraClasses="mx-2">OR</E2>
                <div className="flex-grow h-px bg-gray-syn6"></div>
              </div>

              <TxnEncodeUrl
                fn={selectedFnFragment.name}
                chainId={chainId}
                contractAddress={address}
                fnParams={fnParams}
                abiLeaf={selectedFnFragment}
                mode={'remix'}
              />
              <B3 extraClasses="mt-2 text-gray-syn3">
                Members can run this function themselves via the special link
                above.
              </B3>
            </div>
          )}
        </SharedAbiFnModal>
      </div>
    </>
  );
};

export default AbiUI;
