import { useState, useEffect } from 'react';
import Image from 'next/image';
import AutoGrowInputField from '@/components/inputs/autoGrowInput';
import { L2 } from '@/components/typography';
import { CTAButton, CTAType } from '@/components/CTAButton';
import DealAccountSwitcher from '@/features/deals/components/details/dealAccountSwitcher';

export type Wallet = {
  address: string;
  name?: string;
  avatar: string;
};
interface DealAllocationCardProps {
  dealCommitTokenLogo: string;
  dealCommitTokenSymbol: string;
  minimumCommitAmount: string;
  wallets: Wallet[] | [];
  walletBalance: string;
  walletProviderName: string;
  connectedWallet: Wallet;
}
export const DealAllocationCard: React.FC<DealAllocationCardProps> = ({
  dealCommitTokenLogo,
  dealCommitTokenSymbol,
  minimumCommitAmount,
  wallets,
  walletBalance,
  walletProviderName,
  connectedWallet
}) => {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  // switch to a different account
  const handleAccountSwitch = (account: string): void => {
    console.log(account);
  };

  // TODO: open modal to submit allowance/allocation
  const handleSubmit = (): void => {
    console.log('Submit allocation amount');
  };

  useEffect(() => {
    if (!amount) {
      setAmountError('please input an amount');
    } else if (+amount < +minimumCommitAmount) {
      setAmountError(`minimum amount is ${minimumCommitAmount}`);
    } else {
      setAmountError('');
    }
  }, [amount, minimumCommitAmount]);

  return (
    <div className="rounded-2.5xl bg-gray-syn8 p-8 space-y-4.5 max-w-120">
      {/* title  */}
      <L2 extraClasses="text-white">Allocate to deal</L2>

      {/* amount input field */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start">
          <AutoGrowInputField
            value={amount}
            onChangeHandler={(value) => setAmount(value)}
            placeholder={'0'}
            decimalSeparator="."
            decimalScale={2}
            hasError={Boolean(amountError)}
            disabled={false}
          />

          {/* minimum amount pill  */}
          {!amountError ? (
            <div className="py-1.5 px-4 text-gray-syn4 bg-gray-syn7 text-sm rounded-5.5xl">
              {`min (${minimumCommitAmount})`}
            </div>
          ) : null}

          {/* validation error message  */}
          {amountError ? (
            <div className="text-sm text-red-error cursor-default">
              {amountError}
            </div>
          ) : null}
        </div>

        {/* deal commit token symbol  */}
        <div className="flex items-center justify-start space-x-2">
          <Image src={dealCommitTokenLogo} height={24} width={24} />
          <p className="ml-2 text-base text-white">{dealCommitTokenSymbol}</p>
        </div>
      </div>

      {/* connected wallet  */}
      <DealAccountSwitcher
        {...{
          dealCommitTokenSymbol,
          walletBalance,
          walletProviderName,
          connectedWallet,
          wallets,
          handleAccountSwitch
        }}
      />

      {/* allocation CTA  */}
      <CTAButton
        onClick={handleSubmit}
        disabled={Boolean(amountError)}
        fullWidth={true}
        type={CTAType.PRIMARY}
      >
        Request allocation
      </CTAButton>
    </div>
  );
};
