import { InputField } from '@/components/inputField';
import { FunctionFragment } from 'ethers/lib/utils';
import { ChangeEvent } from 'react';
import { FuncInput } from '@/types/remix';
import { B2 } from '../../../../components/typography';
import { cleanupInputValue, mapValueToPlaceholder } from '../encodeParams';

interface FragmentInputsProps {
  clearResponse: () => void;
  funcABI: FunctionFragment;
  fnParams: Record<string, string | number | boolean>;
  setFnParams: (params: any) => void;
}

const FragmentInputs: React.FC<FragmentInputsProps> = ({
  clearResponse,
  funcABI,
  fnParams,
  setFnParams
}: FragmentInputsProps) => {
  return (
    <>
      {/* inputs */}
      <div
        className={`${
          !(funcABI.inputs && funcABI.inputs.length > 0) ? 'hidden' : ''
        }`}
      >
        <div>
          {funcABI.inputs.map((inp: FuncInput, index: number) => {
            const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
              const newValue = cleanupInputValue(e.target.value);
              clearResponse();
              setFnParams((oldParams: any) => ({
                ...oldParams,
                [inp.name]: newValue
              }));
            };

            return (
              <div className="py-4" key={index}>
                {inp.name && (
                  <B2>{`${inp.name.slice(0, 1).toUpperCase()}${inp.name.slice(
                    1
                  )}`}</B2>
                )}
                <InputField
                  value={fnParams[inp.name]?.toString() ?? ''}
                  onChange={handleChange}
                  //TODO: [REMIX] map inp.type to placeholders
                  placeholder={mapValueToPlaceholder(inp?.type)}
                  extraClasses="mt-2"
                  // isInErrorState={}
                  // infoLabel={}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FragmentInputs;
