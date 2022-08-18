import useGasDetails, { ContractMapper } from '@/hooks/useGasDetails';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';

interface Props {
  contract: ContractMapper;
  customClasses?: string;
  withFiatCurrency?: boolean;
  args?: Record<string, any>;
  skipQuery?: boolean;
}

const EstimateGas: React.FC<Props> = ({
  contract,
  customClasses = '',
  withFiatCurrency = false,
  args = {},
  skipQuery = false
}) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const { gas, fiatAmount } = useGasDetails({
    contract,
    withFiatCurrency,
    args,
    skipQuery
  });

  return (
    <button
      className={
        !customClasses
          ? `bg-blue-navy bg-opacity-20 rounded-custom w-full flex py-2.5 cursor-default items-center`
          : `${customClasses}`
      }
    >
      <span className="flex flex-col lg:flex-row space-x-0 lg:space-x-6 space-y-6 lg:space-y-0 justify-center lg:justify-between w-full px-3">
        <div className="flex items-center space-x-3 justify-center lg:justify-start">
          <img src="/images/gasIcon.svg" className="inline w-4 h-4.5" alt="" />
          <span className="text-blue ">Estimated gas</span>
        </div>

        <span className="mr-3 text-blue space-x-2">
          <span>
            {gas
              ? `${gas.toFixed(6)} ${activeNetwork.nativeCurrency.symbol}`
              : `- ${activeNetwork.nativeCurrency.symbol}`}
          </span>
          {withFiatCurrency && fiatAmount && (
            <span>
              (~
              {Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(+fiatAmount)}
              )
            </span>
          )}
        </span>
      </span>
    </button>
  );
};

export default EstimateGas;
