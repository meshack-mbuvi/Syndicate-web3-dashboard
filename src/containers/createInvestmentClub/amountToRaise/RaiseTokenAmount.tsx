import {
  InputFieldWithToken,
  SymbolDisplay
} from '@/components/inputs/inputFieldWithToken';
import { FL } from '@/components/typography';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import { CreateFlowStepTemplate } from '@/templates/createFlowStepTemplate';
import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * Raise token amount component with select token button and input field for amount
 * @param {*} props
 */
const RaiseTokenAmount = (props: {
  title: string;
  onChange: (e: any) => void;
  handleButtonClick: () => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value: string;
  type?: string;
  depositTokenLogo?: string;
  moreInfo?: string;
  addSettingDisclaimer?: boolean;
  className?: string;
  nextBtnDisabled: boolean;
  onFocus?: () => void;
  isReview?: boolean;
}): JSX.Element => {
  const {
    onChange,
    handleButtonClick,
    placeholder,
    error,
    isReview,
    value,
    className = 'w-full',
    depositTokenLogo = '/images/token-gray-4.svg'
  } = props;

  const { handleNext } = useCreateInvestmentClubContext();

  const {
    createInvestmentClubSliceReducer: {
      investmentClubSymbol,
      tokenDetails: { depositTokenSymbol }
    },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  return (
    <div className={className}>
      {isReview ? (
        <div className="w-full space-y-8">
          <div className="">
            <FL extraClasses="mb-2.5">Accepts deposits in</FL>

            <button
              className="flex w-full justify-center items-center cursor-pointer"
              onClick={handleButtonClick}
              onFocus={(): void => setActiveInputIndex(0)}
            >
              <div
                className={
                  'p-4 flex w-full border rounded-md overflow-hidden justify-between items-center border-gray-24 hover:border-gray-syn3'
                }
              >
                <div className="flex items-center">
                  <div className="relative w-5 h-5">
                    <Image layout="fill" src={depositTokenLogo} />
                  </div>
                  <span className="ml-2 uppercase">{depositTokenSymbol}</span>
                </div>
                <div className="flex relative h-5 w-5">
                  <Image
                    layout="fill"
                    src="/images/double-chevron.svg"
                    alt=""
                  />
                </div>
              </div>
            </button>
          </div>

          <div className="w-full">
            <FL extraClasses="mb-2.5">Upper limit</FL>
            <InputFieldWithToken
              infoLabel={''}
              placeholderLabel={placeholder}
              symbolDisplayVariant={SymbolDisplay.ONLY_LOGO}
              onChange={(e): void => {
                if (isNaN(Number(e.target.value.replace(/,/g, '')))) {
                  return;
                }
                onChange(e);
              }}
              extraClasses={`flex w-full min-w-0 text-base font-whyte flex-grow dark-input-field-advanced ${
                error ? 'border border-red-500 focus:border-red-500' : ''
              }`}
              value={value}
              depositTokenLogo={depositTokenLogo}
              onFocus={(): void => setActiveInputIndex(1)}
            />
          </div>
        </div>
      ) : (
        <CreateFlowStepTemplate
          hideCallouts={false}
          title={'What’s your fundraising goal?'}
          activeInputIndex={activeInputIndex}
          showNextButton={true}
          isNextButtonDisabled={false}
          handleNext={handleNext}
          inputs={[
            {
              label: 'Accepts deposits in',
              info: 'By default, this token is non-transferable, but you can change this to allow your members to transfer their holdings. Changing this later will require an on-chain transaction with gas.',
              input: (
                <div>
                  <button
                    className="flex w-full justify-center items-center cursor-pointer"
                    onClick={handleButtonClick}
                    onFocus={(): void => setActiveInputIndex(0)}
                  >
                    <div
                      className={
                        'p-4 flex w-full border rounded-md overflow-hidden justify-between items-center border-gray-24 hover:border-gray-syn3'
                      }
                    >
                      <div className="flex items-center">
                        <div className="relative w-5 h-5">
                          <Image layout="fill" src={depositTokenLogo} />
                        </div>
                        <span className="ml-2 uppercase">
                          {depositTokenSymbol}
                        </span>
                      </div>
                      <div className="flex relative h-5 w-5">
                        <Image
                          layout="fill"
                          src="/images/double-chevron.svg"
                          alt=""
                        />
                      </div>
                    </div>
                  </button>
                </div>
              )
            },
            {
              label: 'Upper limit',
              info: `Deposits collected in ${depositTokenSymbol}. Members will receive 
                ${
                  depositTokenSymbol === activeNetwork.nativeCurrency.symbol
                    ? '10,000'
                    : '1'
                }
                ✺${investmentClubSymbol}${
                depositTokenSymbol === activeNetwork.nativeCurrency.symbol
                  ? 's'
                  : ''
              } 
                for every 1 ${depositTokenSymbol} deposited.`,
              input: (
                <InputFieldWithToken
                  placeholderLabel={placeholder}
                  symbolDisplayVariant={SymbolDisplay.ONLY_LOGO}
                  onChange={(e): void => {
                    if (isNaN(Number(e.target.value.replace(/,/g, '')))) {
                      return;
                    }
                    onChange(e);
                  }}
                  extraClasses={`flex w-full min-w-0 text-base font-whyte flex-grow dark-input-field-advanced ${
                    error ? 'border border-red-500 focus:border-red-500' : ''
                  }`}
                  value={value}
                  depositTokenLogo={depositTokenLogo}
                  onFocus={(): void => setActiveInputIndex(1)}
                />
              )
            }
          ]}
        />
      )}
    </div>
  );
};

export default RaiseTokenAmount;
