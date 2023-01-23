import { Callout, CalloutType } from '@/components/callout';
import { CTAButton, CTAStyle, CTAType } from '@/components/CTAButton';
import AutoGrowInputField from '@/components/inputs/autoGrowInput';
import { B3, B4, H2, H4, L2 } from '@/components/typography';
import { JazziconGenerator } from '@/features/auth/components/jazziconGenerator';
import DealAccountSwitcher from '@/features/deals/components/details/dealAccountSwitcher';
import { PrecommitStatus } from '@/hooks/deals/types';
import { formatAddress } from '@/utils/formatAddress';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export type Wallet = {
  address: string;
  name?: string;
  avatar: string;
};
interface DealAllocationCardProps {
  dealName: string;
  precommitAmount: string;
  dealDepositTokenLogo: string;
  dealDepositTokenSymbol: string;
  minimumCommitAmount: string;
  wallets: Wallet[] | [];
  walletBalance: string;
  walletProviderName: string;
  connectedWallet: Wallet;
  precommitStatus: PrecommitStatus;
  isDealClosed: boolean;
  validUntil?: string;
  handleBackThisDeal: () => void;
  handleValidAmount: (amount: string) => void;
  handleCancelPrecommit: (e: React.MouseEvent<HTMLElement>) => void;
}
export const DealAllocationCard: React.FC<DealAllocationCardProps> = ({
  dealDepositTokenLogo = '/images/token-gray-4.svg',
  dealDepositTokenSymbol,
  minimumCommitAmount,
  wallets,
  walletBalance,
  walletProviderName,
  dealName,
  precommitAmount,
  validUntil = 'accepted or withdrawn',
  precommitStatus = PrecommitStatus.PENDING,
  // isDealClosed = false, // TODO [WINGZ]: add has precommit been rejected for statuschip
  connectedWallet,
  handleBackThisDeal,
  handleValidAmount,
  handleCancelPrecommit
}) => {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  // switch to a different account
  // TODO [ENG-4869]: get wallets + wallet providers
  const handleAccountSwitch = (account: string): void => {
    console.log(account);
  };

  useEffect(() => {
    if (!amount) {
      setAmountError('');
    } else if (+amount < +minimumCommitAmount) {
      setAmountError(`minimum amount is ${minimumCommitAmount}`);
    } else {
      setAmountError('');
      handleValidAmount(amount);
    }
  }, [amount, minimumCommitAmount]);

  // content to show after allocation has been set
  const postAllocationContent = (
    <>
      <B3 extraClasses="text-gray-syn4 mb-1">What you backed</B3>
      <H2 extraClasses="text-white mb-4">{dealName}</H2>
      <div className="space-y-4">
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
                <Image
                  src={dealDepositTokenLogo || '/images/token-gray-4.svg'}
                  height={20}
                  width={20}
                />
                <B3 extraClasses="ml-2 text-white">{dealDepositTokenSymbol}</B3>
              </div>
              <div className="flex justify-start items-center">
                <div className="mr-1">
                  <JazziconGenerator
                    address={connectedWallet.address}
                    diameterRem={0.75}
                  />
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
              <B3 className="ml-2 text-white">{validUntil}</B3>
            </div>
          </div>
        </div>

        {/* info for precommit withdrawal */}
        {precommitStatus === PrecommitStatus.PENDING ? (
          <>
            <Callout type={CalloutType.WARNING}>
              <B3>
                You may withdraw what you backed at anytime until it is accepted
                by the deal maker
              </B3>
            </Callout>

            {/* cta to withdraw allocation */}
            <CTAButton
              style={CTAStyle.DARK_OUTLINED}
              type={CTAType.PRIMARY}
              onClick={handleCancelPrecommit}
              fullWidth={true}
            >
              Withdraw from deal
            </CTAButton>
          </>
        ) : precommitStatus === PrecommitStatus.EXECUTED ? (
          <Callout type={CalloutType.TRANSACTIONAL}>
            <B3>Your allocation was accepted!</B3>
          </Callout>
        ) : null}

        {/* //[ENG-4926]: precommit failed state or what is action required state - and what to render?*/}
        {/* //[ENG-4926]: precommit rejected - what to render?*/}
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
            onChangeHandler={(value): void => setAmount(value)}
            placeholder={'0'}
            decimalSeparator="."
            decimalScale={2}
            hasError={Boolean(amountError)}
            disabled={false}
          />

          {/* minimum amount pill  */}
          {!amount ? (
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
          <Image
            src={dealDepositTokenLogo || '/images/token-gray-4.svg'}
            height={24}
            width={24}
          />
          <p className="ml-2 text-base text-white">{dealDepositTokenSymbol}</p>
        </div>
      </div>

      {/* connected wallet  */}
      <DealAccountSwitcher
        {...{
          dealDepositTokenSymbol,
          walletBalance,
          walletProviderName,
          connectedWallet,
          wallets,
          handleAccountSwitch
        }}
      />

      {/* allocation CTA  */}
      <CTAButton
        onClick={handleBackThisDeal}
        disabled={!amount || Boolean(amountError)}
        fullWidth={true}
        type={CTAType.PRIMARY}
      >
        Back this deal
      </CTAButton>
    </>
  );

  const showPostAllocationContent = precommitStatus !== PrecommitStatus.FAILED;

  return (
    <div
      className={`rounded-2.5xl bg-gray-syn8 p-8 ${
        !showPostAllocationContent ? 'space-y-4.5' : ''
      } max-w-120`}
    >
      {showPostAllocationContent ? postAllocationContent : preAllocationContent}
    </div>
  );
};
