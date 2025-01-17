import { ClubMixinParams } from '@/ClubERC20Factory/ERC20ClubFactory';
import { IDealParams } from '@/ClubERC20Factory/ERC20DealFactory';
import { ICollectiveParams } from '@/ClubERC20Factory/ERC721CollectiveFactory';
import useGasDetails, { ContractMapper } from '@/hooks/useGasDetails';
import { AppState } from '@/state';
import { FunctionFragment } from 'ethers/lib/utils';
import { useSelector } from 'react-redux';

interface RemixDetails {
  inputValues: string[] | undefined;
  abiFunction: FunctionFragment | null;
  remixContractAddress: string;
  remixAbi: AbiItem[];
}

export type GasArgs = Record<
  string,
  | ClubMixinParams
  | ICollectiveParams
  | IDealParams
  | string
  | number
  | boolean
  | BN
  | string[]
  | Date
>;

interface Props {
  contract: ContractMapper;
  customClasses?: string;
  withFiatCurrency?: boolean;
  args?: GasArgs;
  skipQuery?: boolean;
  remixDetails?: RemixDetails;
}

const EstimateGas: React.FC<Props> = ({
  contract,
  customClasses = '',
  withFiatCurrency = false,
  args,
  skipQuery = false,
  remixDetails
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
    skipQuery,
    remixDetails
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
