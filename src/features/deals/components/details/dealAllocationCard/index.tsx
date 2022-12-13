import { useState, useEffect } from 'react';
import Image from 'next/image';
import AutoGrowInputField from '@/components/inputs/autoGrowInput';
import { L2, B3, H2, B4, H4 } from '@/components/typography';
import { CTAButton, CTAType, CTAStyle } from '@/components/CTAButton';
import DealAccountSwitcher from '@/features/deals/components/details/dealAccountSwitcher';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { formatAddress } from '@/utils/formatAddress';

export type Wallet = {
  address: string;
  name?: string;
  avatar: string;
};
interface DealAllocationCardProps {
  dealName: string;
  precommitAmount: string;
  dealCommitTokenLogo: string;
  dealCommitTokenSymbol: string;
  minimumCommitAmount: string;
  wallets: Wallet[] | [];
  walletBalance: string;
  walletProviderName: string;
  connectedWallet: Wallet;
  showPostAllocationContent: boolean;
}
export const DealAllocationCard: React.FC<DealAllocationCardProps> = ({
  dealCommitTokenLogo,
  dealCommitTokenSymbol,
  minimumCommitAmount,
  wallets,
  walletBalance,
  walletProviderName,
  dealName,
  precommitAmount,
  showPostAllocationContent = false,
  connectedWallet
}) => {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  // switch to a different account
  const handleAccountSwitch = (account: string): void => {
    console.log(account);
  };

  // open modal to initiate allocation withdrawal
  const handleWithdrawAllocation = (): void => {
    console.log('withdrawing allocation');
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

  // content to show after allocation has been set
  const postAllocationContent = (
    <>
      <B3 extraClasses="text-gray-syn4 mb-2">What you backed</B3>
      <div className="space-y-4">
        <H2 extraClasses="text-white">{dealName}</H2>

        {/* allocation details  */}
        <div className="rounded-custom divide-y-1 divide-gray-syn6 border border-gray-syn6">
          <div className="flex py-6 px-4.5 space-x-1 items-start justify-between">
            <B3 extraClasses="text-gray-syn3 w-1/4 ">Amount</B3>
            <div className="flex flex-col items-start justify-start w-3/4 -mt-1">
              <div className="flex items-center">
                <div className="mr-2 text-white">
                  <H4 extraclasses="text-white">
                    {floatedNumberWithCommas(precommitAmount)}
                  </H4>
                </div>
                <Image src={dealCommitTokenLogo} height={20} width={20} />
                <B3 extraClasses="ml-2 text-white">{dealCommitTokenSymbol}</B3>
              </div>
              <div className="flex justify-start items-center">
                {/* use jazz icon generator here once this PR is merged: https://github.com/SyndicateProtocol/Syndicate-Web3-Dashboard/pull/1858 */}
                <div className="mr-1">
                  <Image src="/images/jazzicon.png" width={12} height={12} />
                </div>

                <B4 extraClasses="text-gray-syn4">
                  {connectedWallet?.name
                    ? connectedWallet.name
                    : formatAddress(connectedWallet.address, 6, 4)}
                </B4>
              </div>
            </div>
          </div>
          <div className="flex py-6 px-4.5 items-center justify-between">
            <B3 extraClasses="text-gray-syn3 w-1/4">Valid until</B3>
            <div className="flex items-center justify-start space-x-2 w-3/4">
              <B3 className="ml-2 text-white">accepted or withdrawn</B3>
            </div>
          </div>
        </div>

        {/* info for precommit withdrawal */}
        <div className="bg-yellow-warning bg-opacity-10 rounded-xl px-5 py-4">
          <B3 extraClasses="text-white">
            You may withdraw what you backed at anytime until it is accepted by
            the deal maker
          </B3>
        </div>

        {/* cta to withdraw allocation  */}
        <CTAButton
          style={CTAStyle.DARK_OUTLINED}
          type={CTAType.PRIMARY}
          onClick={handleWithdrawAllocation}
          fullWidth={true}
        >
          Withdraw from deal
        </CTAButton>
      </div>
    </>
  );

  // default content to show
  const preAllocationContent = (
    <>
      {/* title  */}
      <L2 extraClasses="text-white">Back this deal</L2>

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
            <button
              className="py-1.5 px-4 text-gray-syn4 bg-gray-syn7 text-sm rounded-5.5xl"
              onClick={(): void => setAmount(minimumCommitAmount)}
            >
              {`min (${minimumCommitAmount})`}
            </button>
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
        Back this deal
      </CTAButton>
    </>
  );

  return (
    <div className="rounded-2.5xl bg-gray-syn8 p-8 space-y-4.5 max-w-120">
      {showPostAllocationContent ? postAllocationContent : preAllocationContent}
    </div>
  );
};
