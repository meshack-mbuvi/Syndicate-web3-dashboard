import { InputField } from '@/components/inputs/inputField';
import { AppState } from '@/state';
import { useSelector, useDispatch } from 'react-redux';
import { setMaxSupply } from '@/state/collectiveDetails';
import { B2, B3 } from '@/components/typography';
import { stringNumberRemoveCommas } from '@/utils/formattedNumbers';
import { useUpdateState } from '@/hooks/collectives/useCreateCollective';

const EditMaxSupply: React.FC = () => {
  const {
    collectiveDetailsReducer: {
      details: { maxSupply }
    }
  } = useSelector((state: AppState) => state);

  const { handleMaxPerWalletChange } = useUpdateState();

  const dispatch = useDispatch();

  return (
    <div className="w-full">
      <B2>Max supply of NFTs</B2>
      <InputField
        value={
          maxSupply
            ? maxSupply.toLocaleString(undefined, {
                maximumFractionDigits: 18
              })
            : ''
        }
        onChange={(e) => {
          const amount = stringNumberRemoveCommas(e.target.value);
          if (Number(amount)) {
            dispatch(setMaxSupply(Number(amount)));
          } else if (amount === '') {
            // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to par... Remove this comment to see the full error message
            dispatch(setMaxSupply(null));
          }
        }}
        placeholderLabel="e.g. 1,000"
        extraClasses="my-2"
      />
      <B3 extraClasses="text-gray-syn4">
        Tip:{' '}
        <button
          onClick={() => {
            handleMaxPerWalletChange(1);
          }}
          className="text-blue-neptune text-left"
        >
          Set “max per wallet” to 1
        </button>{' '}
        to more accurately track member count.
      </B3>
    </div>
  );
};

export default EditMaxSupply;
