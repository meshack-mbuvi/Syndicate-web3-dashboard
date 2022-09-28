import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { toChecksumAddress } from 'ethereumjs-util';
import { getInputs, shortenAddress, sortAbiFunction } from '@/utils/remix';
import AbiFnUI from './AbiFnUI';
import { FunctionFragment } from 'ethers/lib/utils';

/* 
  Largely pased on UniversalDappUI component from remix project
  Copyright (c) 2016-2018 Contributors, released under MIT License 
  https://github.com/ethereum/remix-project/blob/master/LICENSE
  */

export interface AbiUIProps {
  instance: {
    address: string;
    chainId: number;
    name: string;
    abi: any;
  };
  setFnFragment: (fn: FunctionFragment) => void;
  setFnLookupOnly: (isLookup: boolean) => void;
  setShowFnModal: (bool: boolean) => void;
}

const AbiUI: React.FC<AbiUIProps> = ({
  instance,
  setFnFragment,
  setFnLookupOnly,
  setShowFnModal
}: AbiUIProps) => {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [abiFns, setAbiFns] = useState<FunctionFragment[]>();
  const [processedAddress, setProcessedAddress] = useState<string>('');

  const { abi, address, name } = instance;

  useEffect(() => {
    if (abi) {
      setAbiFns(sortAbiFunction(abi) as FunctionFragment[]);
    }
  }, [abi]);

  useEffect(() => {
    if (address) {
      const stringyAddress =
        (address.slice(0, 2) === '0x' ? '' : '0x') + address.toString();

      const checkSummedAddress = toChecksumAddress(stringyAddress);
      setProcessedAddress(checkSummedAddress);
    }
  }, [address]);

  const expandOptions = () => {
    setExpanded(!isExpanded);
  };

  return (
    <div id={`instance${address}`} className="w-full max-w-88">
      <div className="flex align-items-center">
        <button onClick={expandOptions}>
          <div className="flex justify-content-center mr-1">
            <Image
              src={
                isExpanded
                  ? '/images/chevron-down.svg'
                  : '/images/chevron-right-gray.svg'
              }
              width={20}
              height={18}
              objectFit="contain"
            />
          </div>
        </button>
        <div className="">
          <span className="">
            {name} at {shortenAddress(processedAddress)}
          </span>
        </div>
      </div>
      <div className={`${isExpanded ? '' : 'hidden'}`} data-id="">
        <div className="">
          {abiFns &&
            abiFns.map((funcABI, index) => {
              if (funcABI.type !== 'function') return null;
              const isConstant =
                funcABI.constant !== undefined ? funcABI.constant : false;
              const lookupOnly =
                funcABI.stateMutability === 'view' ||
                funcABI.stateMutability === 'pure' ||
                isConstant;
              const inputs = getInputs(funcABI);

              return (
                <div key={index} className={`mt-4`}>
                  <AbiFnUI
                    funcABI={funcABI}
                    inputs={inputs}
                    lookupOnly={lookupOnly}
                    setFnFragment={setFnFragment}
                    setFnLookupOnly={setFnLookupOnly}
                    setShowFnModal={setShowFnModal}
                    key={index}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AbiUI;
