import { InputField } from '@/components/inputField';
import { FunctionFragment } from 'ethers/lib/utils';
import { ChangeEvent } from 'react';
import { FuncInput } from '@/types/remix';
import { B2 } from '../../../../components/typography';
import { mapValueToPlaceholder } from '../encodeParams';

interface FragmentInputsProps {
  fnFragment: FunctionFragment;
  fnParams: Record<string, string | number | boolean>;
  setFnParams: (params: any) => void;
}

const FragmentInputs: React.FC<FragmentInputsProps> = ({
  fnFragment,
  fnParams,
  setFnParams
}: FragmentInputsProps) => {
  return (
    <>
      {/* inputs */}
      <div
        className={`${
          !(fnFragment.inputs && fnFragment.inputs.length > 0) ? 'hidden' : ''
        }`}
      >
        <div>
          {fnFragment.inputs.map((inp: FuncInput, index: number) => {
            const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
              setFnParams((oldParams: any) => ({
                ...oldParams,
                [inp.name]: e.target.value
              }));
            };

            return (
              <div className="py-3" key={index}>
                {inp.name && (
                  <B2>{`${inp.name.slice(0, 1).toUpperCase()}${inp.name.slice(
                    1
                  )}`}</B2>
                )}
                <InputField
                  value={fnParams[inp.name]?.toString() ?? ''}
                  onChange={handleChange}
                  placeholder={mapValueToPlaceholder(inp?.type)}
                  extraClasses="mt-2"
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
