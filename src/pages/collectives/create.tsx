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

  const [txn, setTxn] = useState<string>();
  const { gasPrice, getEstimateGas } = useGasEstimate();

  const totalSupply = 10000;
  const maxPerMember = 3;
  const ethPrice = getWeiAmount(web3, '0.5', 18, true);
  const tokenURI = 'ipfs://hash';

  const createCollective = async () => {
    const collectiveParams = {
      collectiveName,
      collectiveSymbol,
      totalSupply,
      maxPerMember,
      ethPrice,
      tokenURI,
      startTime: '0',
      endTime: '1684952525'
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
