import React from 'react';
import { B2 } from '../../../components/typography';
import Image from 'next/image';
import { FunctionFragment } from 'ethers/lib/utils';
{
  /* 
  Largely pased on ContractGUI component from remix project
  Copyright (c) 2016-2018 Contributors, released under MIT License 
  https://github.com/ethereum/remix-project/blob/master/LICENSE
  */
}
export interface AbiFnUIProps {
  funcABI: FunctionFragment;
  inputs: string;
  lookupOnly: boolean;
  setFnFragment: (fn: FunctionFragment) => void;
  setFnLookupOnly: (isLookup: boolean) => void;
  setShowFnModal: (bool: boolean) => void;
}

const AbiFnUI: React.FC<AbiFnUIProps> = ({
  funcABI,
  inputs,
  lookupOnly,
  setFnFragment,
  setFnLookupOnly,
  setShowFnModal
}: AbiFnUIProps) => {
  const selectFn = (): void => {
    setFnFragment(funcABI);
    setFnLookupOnly(lookupOnly);
    setShowFnModal(true);
  };

  return (
    <>
      <div
        className={`w-full ${
          (funcABI.inputs && funcABI.inputs.length > 0) ||
          funcABI.type === 'fallback' ||
          funcABI.type === 'receive'
            ? ''
            : ''
        }`}
      >
        <div className="flex flex-nowrap">
          <B2 extraClasses="flex-initial shrink-1 min-w-0">{`${
            lookupOnly ? '[read]' : ''
          }${funcABI.name}`}</B2>
          <div className="flex-1 shrink min-w-0 float-left overflow-hidden mr-1">
            <B2 extraClasses="min-w-0 whitespace-nowrap text-ellipsis inline-block">
              {inputs ? ': ' + inputs : ''}
            </B2>
          </div>
          <div className="grow shrink-0 self-end min-w-0">
            <button
              onClick={selectFn}
              title={funcABI.name}
              className={'flex-none justify-self-end'}
            >
              <div>
                <Image
                  src={'/images/managerActions/arrowRight.svg'}
                  width={16}
                  height={13}
                  objectFit="contain"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AbiFnUI;
