import { InputField } from '@/components/inputs/inputField';
import { stringNumberRemoveCommas } from '@/utils/formattedNumbers';

interface Props {
  maxPerWallet: number;
  handleMaxPerWalletChange: (newMax: number) => void;
  extraClasses?: string;
}

export const InputFieldMaxPerWallet: React.FC<Props> = ({
  maxPerWallet,
  handleMaxPerWalletChange,
  extraClasses
}) => {
  return (
    <InputField
      value={
        maxPerWallet
          ? maxPerWallet.toLocaleString(undefined, {
              maximumFractionDigits: 18
            })
          : ''
      }
      onChange={(e) => {
        const amount = stringNumberRemoveCommas(e.target.value);
        if (Number(amount)) {
          handleMaxPerWalletChange(Number(amount));
        } else if (amount === '') {
          handleMaxPerWalletChange(null);
        }
      }}
      placeholderLabel="e.g. 1"
      extraClasses={extraClasses}
    />
  );
};
