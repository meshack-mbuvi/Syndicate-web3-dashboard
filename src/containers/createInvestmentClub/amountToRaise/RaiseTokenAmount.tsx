import { SettingsDisclaimerTooltip } from '@/containers/createInvestmentClub/shared/SettingDisclaimer';
import cn from 'classnames';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import {
  InputFieldWithToken,
  SymbolDisplay
} from '@/components/inputs/inputFieldWithToken';
import { defaultTokenDetails } from '../shared/ClubTokenDetailConstants';
import Image from 'next/image';

/**
 * Raise token amount component with select token button and input field for amount
 * @param {*} props
 */
const RaiseTokenAmount = (props: {
  title: string;
  onChange: (e) => void;
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
}): JSX.Element => {
  const {
    title,
    onChange,
    handleButtonClick,
    placeholder,
    error,
    value,
    depositTokenLogo = '/images/token-gray-4.svg',
    moreInfo,
    addSettingDisclaimer,
    className
  } = props;

  const {
    createInvestmentClubSliceReducer: {
      investmentClubSymbol,
      tokenDetails: { depositTokenSymbol }
    }
  } = useSelector((state: AppState) => state);

  return (
    <div className={className}>
      <h3 className="mb-1">{title}</h3>
      <span className="text-sm text-gray-syn4 font-whyte">{moreInfo}</span>
      <label className="mt-5 block text-base text-white font-whyte leading-5 mb-2">
        {'Select token'}
      </label>
      <button
        className="flex w-full justify-center items-center cursor-pointer"
        onClick={handleButtonClick}
      >
        <div
          className={
            'p-4 flex w-full border rounded-md overflow-hidden justify-between items-center border-gray-24 hover:border-gray-syn3'
          }
        >
          <div className="flex items-center">
            <div className="relative w-5 h-5">
              <Image
                layout="fill"
                src={depositTokenLogo || '/images/token-gray-4.svg'}
              />
            </div>
            <span className="ml-2 uppercase">{depositTokenSymbol}</span>
          </div>
          <div className="flex relative h-5 w-5">
            <Image layout="fill" src="/images/double-chevron.svg" alt="" />
          </div>
        </div>
      </button>
      <p className="mt-6">Enter amount</p>
      <div
        className={cn(
          'mt-2 w-full flex border rounded-md overflow-hidden border-gray-24 hover:border-gray-syn3',
          {
            'border-red-error': error
          }
        )}
        data-tip
        data-for="disclaimer-tip"
      >
        <InputFieldWithToken
          placeholderLabel={placeholder}
          symbolDisplayVariant={SymbolDisplay.ONLY_LOGO}
          onChange={(e) => {
            if (isNaN(e.target.value.replace(/,/g, ''))) {
              return;
            }
            onChange(e);
          }}
          extraClasses={`flex w-full border-none min-w-0 text-base font-whyte focus:ring-0 ${
            error ? 'border border-red-500 focus:border-red-500' : ''
          } flex-grow rounded-l-md dark-input-field-advanced`}
          value={value}
          depositTokenLogo={depositTokenLogo || '/images/token-gray-4.svg'}
        />
      </div>
      {addSettingDisclaimer ? (
        <div className="hidden lg:flex pl-4 justify-center items-center w-1/3 absolute">
          <SettingsDisclaimerTooltip
            id="disclaimer-tip"
            tip={
              <span className=" text-white font-whyte text-sm">
                Deposits collected in {depositTokenSymbol}. Members
                <br />
                will receive {depositTokenSymbol === 'ETH' ? '10,000' : '1'} ✺
                {investmentClubSymbol} club token
                {depositTokenSymbol === 'ETH' && 's'} <br />
                for every 1 {depositTokenSymbol} deposited.
              </span>
            }
          />
        </div>
      ) : null}
      {error ? (
        <div className="w-full">
          <p className="text-red-500 text-sm mb-1">{error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default RaiseTokenAmount;
