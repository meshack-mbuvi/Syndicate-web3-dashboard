import React, { useCallback, useEffect, useState } from 'react';
import { getInputs, sortAbiFunction } from '@/utils/remix';
import { FunctionFragment } from 'ethers/lib/utils';
import SharedAbiFnModal from './SharedAbiFnModal';
import AbiFnUI from './modalSteps/AbiFnUI';
import { B1, B2, B3, B4, E2 } from '@/components/typography';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { StepsOutline } from '@/components/stepsOutline';
import { CTAButton } from '@/components/CTAButton';
import FragmentInputs from './modalSteps/FragmentInputs';
import TxnEncodeUrl from './TxnEncodeUrl';
import RemixLink from './RemixLink';

export interface AbiUIProps {
  instance: {
    address: string;
    chainId: number;
    name: string;
    abi: any;
    isSyndicateSupported: boolean;
    isActive: boolean;
    isUnverified?: boolean;
    invalidResponse?: string;
  };
  showFnModal: boolean;
  setShowFnModal: (bool: boolean) => void;
  handleToggleModal: () => void;
  setFnFragment: (fn: FunctionFragment) => void;
  setFnLookupOnly: (isLookup: boolean) => void;
  clearResponse: () => void;
  selectedFnFragment?: FunctionFragment | null;
  selectedLookupOnly?: boolean;
}

const AbiUI: React.FC<AbiUIProps> = ({
  instance,
  showFnModal,
  setShowFnModal,
  handleToggleModal,
  setFnFragment,
  setFnLookupOnly,
  clearResponse,
  selectedFnFragment,
  selectedLookupOnly
}: AbiUIProps) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const [abiFns, setAbiFns] = useState<FunctionFragment[]>();

  //steps
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const {
    abi,
    address,
    name,
    chainId,
    isSyndicateSupported,
    isActive,
    isUnverified,
    invalidResponse
  } = instance;

  const handleClose = useCallback(() => {
    setShowFnModal(false);
    setActiveStepIndex(0);
    handleToggleModal();
  }, [handleToggleModal, setShowFnModal]);

  useEffect(() => {
    if (abi) {
      setAbiFns(sortAbiFunction(abi) as FunctionFragment[]);
    }
  }, [abi]);

  useEffect(() => {
    if (activeStepIndex > 1) {
      setTimeout(() => handleClose(), 500);
    }
  }, [activeStepIndex, handleClose]);

  const [fnParams, setFnParams] = useState<
    Record<string, string | number | boolean>
  >({});

  useEffect(() => {
    if (!selectedFnFragment?.inputs) return;
    setFnParams({});
    selectedFnFragment.inputs.forEach((inp) => {
      setFnParams((oldParams) => ({
        ...oldParams,
        [inp.name]: ''
      }));
    });
  }, [selectedFnFragment]);

  const handleStepAction = (): void => {
    setActiveStepIndex(activeStepIndex + 1);
  };

  return (
    <>
      {!isUnverified && !invalidResponse && (
        <div id={`instance${address}`}>
          <button
            onClick={handleToggleModal}
            className={`${
              isActive ? 'bg-gray-syn8' : 'border-1 border-gray-syn7'
            } rounded-2.5xl px-8 py-5 mb-5 max-w-88`}
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
              <B3 extraClasses="text-gray-syn3 mb-5 text-left">
                TODO: REPLACE WITH CRAFTED MODULE DESCRIPTIONS Allows the
                Collective owner to &#34;airdrop&#34; a list of recipient
                addresses as a Merkle tree, and allows recipients on that list
                to claim a token.
              </B3>
              <E2 extraClasses="font-normal text-gray-syn4">
                {(abiFns || []).filter((fn) => fn?.type === 'function')?.length}{' '}
                functions
              </E2>
            </div>
          </button>
          <div className={`${showFnModal ? '' : 'hidden'}`} data-id="">
            <SharedAbiFnModal
              showSharedAbiFnModal={showFnModal}
              handleModalClose={handleClose}
              moduleName={name}
              selectedFnFragment={selectedFnFragment}
              selectedLookupOnly={selectedLookupOnly}
              isSyndicateSupported={isSyndicateSupported}
            >
              {!selectedFnFragment ? (
                <>
                  <div className="pt-2 mb-10">
                    <B2 extraClasses="mb-4">
                      TODO: REPLACE WITH CRAFTED MODULE DESCRIPTIONS Allows the
                      Collective owner to &#34;airdrop&#34; a list of recipient
                      addresses as a Merkle tree, and allows recipients on that
                      list to claim a token.
                    </B2>
                    {/* links */}
                    <div className="flex items-center">
                      <RemixLink
                        text="View docs"
                        //TODO: add remix docs
                        link="https://guide.syndicate.io/en/developer-platform/start-here"
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
                        funcABI.constant !== undefined
                          ? funcABI.constant
                          : false;
                      const lookupOnly =
                        funcABI.stateMutability === 'view' ||
                        funcABI.stateMutability === 'pure' ||
                        isConstant;
                      const inputs = getInputs(funcABI);

                      return (
                        <div key={index} className={`mt-2`}>
                          <AbiFnUI
                            funcABI={funcABI}
                            inputs={inputs}
                            lookupOnly={lookupOnly}
                            setFnFragment={setFnFragment}
                            setFnLookupOnly={setFnLookupOnly}
                            key={index}
                          />
                        </div>
                      );
                    })}
                </>
              ) : (
                <>
                  {activeStepIndex === 0 ? (
                    <FragmentInputs
                      clearResponse={clearResponse}
                      funcABI={selectedFnFragment}
                      fnParams={fnParams}
                      setFnParams={setFnParams}
                    />
                  ) : (
                    <TxnEncodeUrl
                      fn={selectedFnFragment.name}
                      chainId={chainId}
                      contractAddress={address}
                      fnParams={fnParams}
                      abiLeaf={selectedFnFragment}
                      mode={'remix'}
                    />
                  )}
                  <StepsOutline
                    activeIndex={activeStepIndex}
                    steps={[
                      {
                        title: 'Input data',
                        description: (
                          <div>
                            <div>{`This ${
                              isSyndicateSupported ? 'custom' : ''
                            } module needs data inputs.`}</div>
                          </div>
                        )
                      },
                      {
                        title: 'Share with members'
                      }
                    ]}
                    alwaysShowDescriptions={true}
                    extraClasses="mt-6"
                  />
                  <div className="mt-6">
                    <CTAButton
                      onClick={handleStepAction}
                      extraClasses={'w-full'}
                    >
                      {activeStepIndex >= 1 ? 'Done' : 'Continue'}
                    </CTAButton>
                  </div>
                </>
              )}
            </SharedAbiFnModal>
          </div>
        </div>
      )}
    </>
  );
};

export default AbiUI;
