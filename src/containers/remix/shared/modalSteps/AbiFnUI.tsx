import React from 'react';
import { M1 } from '../../../../components/typography';
import Image from 'next/image';
import { FunctionFragment } from 'ethers/lib/utils';
export interface AbiFnUIProps {
  funcABI: FunctionFragment;
  inputs: string;
  lookupOnly: boolean;
  setFnFragment: (fn: FunctionFragment) => void;
  setFnLookupOnly: (isLookup: boolean) => void;
}

const AbiFnUI: React.FC<AbiFnUIProps> = ({
  funcABI,
  inputs,
  lookupOnly,
  setFnFragment,
  setFnLookupOnly
}: AbiFnUIProps) => {
  const selectFn = (): void => {
    setFnFragment(funcABI);
    setFnLookupOnly(lookupOnly);
  };

  return (
    <>
      <button
        className={`w-full border-1 border-gray-syn7 rounded-lg px-5 py-4`}
        onClick={selectFn}
        title={funcABI.name}
      >
        <div className="flex flex-nowrap">
          <M1 extraClasses="flex-none grow-0 shrink-1 min-w-0">{`${
            lookupOnly ? '[read]' : ''
          }${funcABI.name}`}</M1>
          <div className="flex-1 min-w-0 overflow-hidden mr-1">
            <M1 extraClasses="float-left min-w-0 whitespace-nowrap text-ellipsis inline-block">
              {inputs ? ': ' + inputs : ''}
            </M1>
          </div>
          <div className="grow shrink-0 self-end justify-self-end">
            <div className="justify-self-end self-end">
              <Image
                src={'/images/managerActions/arrowRight.svg'}
                width={16}
                height={13}
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </button>
    </>
  );
};

export default AbiFnUI;
