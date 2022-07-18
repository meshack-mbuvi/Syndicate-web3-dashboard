/**
 * TODO: This file is for test purposes only
 */
import axios from 'axios';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { InputField } from '@/components/inputs/inputField';
import { AppState } from '@/state';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getWeiAmount } from '@/utils/conversions';
import Layout from '@/components/layout';
import moment from 'moment';

const timeWindow = {
  day: moment().add(1, 'days').valueOf(),
  week: moment().add(1, 'weeks').valueOf(),
  month: moment().add(1, 'months').valueOf()
};

const CollectivesView: React.FC = () => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { erc721CollectiveFactory }
    },
    web3Reducer: {
      web3: { account, web3 }
    }
  } = useSelector((state: AppState) => state);

  const _name = Math.random().toString(36).slice(2, 7);
  const _symbol = Math.random().toString(36).slice(2, 5);

  const [collectiveName, setCollectiveName] = useState<string>(
    'Alpha Beta ' + _name
  );
  const [collectiveSymbol, setCollectiveSymbol] = useState<string>(
    _symbol.toUpperCase()
  );

  const [collectivePrice, setCollectivePrice] = useState('0.5');
  const [collectiveMaxMint, setCollectiveMaxMint] = useState('3');
  const [collectiveTotalSupply, setCollectiveTotalSupply] = useState('10000');
  const [collectiveTime, setCollectiveTime] = useState(
    timeWindow.day.toString()
  );
  const [collectiveIPFS, setCollectiveIPFS] = useState('ipfs://hash');

  const [txn, setTxn] = useState<string>();
  const { gasPrice, getEstimateGas } = useGasEstimate();

  const createCollective = async () => {
    const collectiveParams = {
      collectiveName,
      collectiveSymbol,
      totalSupply: +collectiveTotalSupply,
      maxPerMember: +collectiveMaxMint,
      ethPrice: getWeiAmount(web3, collectivePrice, 18, true),
      tokenURI: collectiveIPFS,
      startTime: '0',
      endTime: collectiveTime
    };

    await erc721CollectiveFactory.createERC721Collective(
      account,
      collectiveParams,
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  };

  const onTxConfirm = (_txn: string) => {
    setTxn(_txn);
  };

  const onTxReceipt = (receipt: unknown) => {
    console.log({ receipt });
  };

  const onTxFail = (error: unknown) => {
    console.log({ error });
  };

  return (
    <Layout>
      <div className="relative container mx-auto">
        <div className="pt-8 pb-4 text-2xl">Create collective (TEST ONLY)</div>

        {/* name */}
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-12 gap-5 group relative items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Collective Name</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <InputField
                  value={collectiveName}
                  onChange={(e) => setCollectiveName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Symbol */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Collective Symbol</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <InputField
                  value={collectiveSymbol}
                  onChange={(e) => setCollectiveSymbol(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Price per NFT */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Price per NFT</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <InputField
                  value={collectivePrice}
                  onChange={(e) => setCollectivePrice(e.target.value)}
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Max per wallet */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Max per wallet</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <InputField
                  value={collectiveMaxMint}
                  onChange={(e) => setCollectiveMaxMint(e.target.value)}
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* Time window */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Time window</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <select
                  name="time"
                  className="mt-1 pl-3 pr-10 py-2 text-base border-gray-300 bg-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  defaultValue={collectiveTime}
                  onChange={(e) => setCollectiveTime(e.target.value)}
                >
                  <option value={timeWindow.day}>24 hours</option>
                  <option value={timeWindow.week}>1 week</option>
                  <option value={timeWindow.month}>1 month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Max supply of NFTs */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Max supply of NFTs</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <InputField
                  value={collectiveTotalSupply}
                  onChange={(e) => setCollectiveTotalSupply(e.target.value)}
                  type="number"
                />
              </div>
            </div>
          </div>

          {/* ipfs hash */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">IPFS hash</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <InputField
                  value={collectiveIPFS}
                  onChange={(e) => setCollectiveIPFS(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-syn7" />

          {/* Estimate Gas Price */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Gas Price</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <span>{gasPrice || '-'} ETH</span>
                <div className="static top-0 right-0">
                  <button
                    className="flex items-center cursor-pointer text-blue-navy"
                    onClick={getEstimateGas}
                  >
                    Estimate Gas
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Txn link */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">View on Etherscan</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <a
                  href={`https://rinkeby.etherscan.io/tx/${txn}`}
                  className="text-blue-500"
                  target="_blank"
                  rel="noreferrer"
                >
                  {txn}
                </a>
              </div>
            </div>
          </div>

          <div>
            <PrimaryButton
              customClasses="primary-CTA w-full mt-6 mb-4"
              textColor="text-black"
              onClick={createCollective}
            >
              Create
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollectivesView;

const useGasEstimate = (): { gasPrice: number; getEstimateGas: () => void } => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { erc721CollectiveFactory }
    },
    web3Reducer: {
      web3: { account, web3, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const [gasPrice, setGasPrice] = useState<number>(0);
  const [gasBaseFee, setGasBaseFee] = useState<number>(0);
  const [gasUnits, setGasUnits] = useState(0);

  useEffect(() => {
    if (!gasUnits || !gasBaseFee) return;
    const estimatedGasInWei = gasUnits * (gasBaseFee + 2);
    const estimatedGas = getWeiAmount(
      web3,
      estimatedGasInWei.toString(),
      18,
      false
    );
    setGasPrice(+estimatedGas);
  }, [gasUnits, gasBaseFee]);

  const getEstimateGas = async () => {
    await Promise.all([
      erc721CollectiveFactory.getEstimateGas(account, setGasUnits),
      await axios
        .get(
          `${activeNetwork.blockExplorer.api}/api?module=proxy&action=eth_gasPrice`
        )
        .then((res) => {
          const baseFee = res.data.result;
          const baseFeeInDecimal = parseInt(baseFee, 16);
          setGasBaseFee(baseFeeInDecimal);
        })
        .catch(() => 0)
    ]);
  };

  return {
    gasPrice,
    getEstimateGas
  };
};
