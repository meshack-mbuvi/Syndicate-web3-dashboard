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
import { CONTRACT_ADDRESSES } from '@/Networks';

const CollectivesView: React.FC = () => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { erc721CollectiveFactory }
    },
    web3Reducer: {
      web3: { account, web3, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const addresses = CONTRACT_ADDRESSES[activeNetwork.chainId];

  const _name = Math.random().toString(36).slice(2, 7);
  const _symbol = Math.random().toString(36).slice(2, 5);

  const [collectiveName, setCollectiveName] = useState<string>(
    'Alpha Beta ' + _name
  );
  const [collectiveSymbol, setCollectiveSymbol] = useState<string>(
    _symbol.toUpperCase()
  );

  const [salt, setSalt] = useState<string>();
  const [contractAddresses, setContractAddresses] = useState<string[]>([]);
  const [encodedFunctions, setEncodedFunctions] = useState<string[]>([]);
  const [predictedAddress, setPredictedAddress] = useState<string>();
  const [txn, setTxn] = useState<string>();

  const { gasPrice, getEstimateGas } = useGasEstimate();

  const totalSupply = 10000;
  const maxPerMember = 3;
  const ethPrice = getWeiAmount(web3, '0.5', 18, true);
  const tokenURI = 'ipfs://hash';

  const generateSalt = async () => {
    const _salt = web3.utils.randomHex(32);
    setSalt(_salt);
  };

  const predictAddress = async () => {
    if (!salt) {
      generateSalt();
    }

    const nextToken = await erc721CollectiveFactory.predictAddress(
      account,
      salt
    );
    setPredictedAddress(nextToken);
  };

  const createSetupParams = async () => {
    const mixins = [
      addresses.TimeRequirements,
      addresses.MaxPerMemberERC721,
      addresses.MaxTotalSupplyERC721
    ];

    const _contractAddresses = [
      addresses.TimeRequirements,
      addresses.MaxTotalSupplyERC721,
      addresses.MaxPerMemberERC721,
      addresses.GuardMixinManager,
      addresses.GuardMixinManager,
      addresses.EthPriceMintModule,
      addresses.FixedRenderer
    ];

    const _encodedFunctions = [
      erc721CollectiveFactory.setTimeRequirements(
        predictedAddress,
        '0',
        '1684952525'
      ),
      erc721CollectiveFactory.setTotalSupplyRequirements(
        predictedAddress,
        totalSupply
      ),
      erc721CollectiveFactory.setMaxPerMemberRequirements(
        predictedAddress,
        maxPerMember
      ),
      erc721CollectiveFactory.updateDefaultMixins(predictedAddress, mixins),
      erc721CollectiveFactory.allowModule(
        predictedAddress,
        addresses.EthPriceMintModule
      ),
      erc721CollectiveFactory.updateEthPrice(predictedAddress, ethPrice),
      erc721CollectiveFactory.updateTokenURI(predictedAddress, tokenURI)
    ];

    setContractAddresses(_contractAddresses);
    setEncodedFunctions(_encodedFunctions);
  };

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
                  onChange={setCollectiveName}
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
                  onChange={setCollectiveSymbol}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-syn7" />

          {/* Salt */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Salt</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <span>{salt || 'null'}</span>
                <div className="static top-0 right-0">
                  <button
                    className="flex items-center cursor-pointer text-blue-navy"
                    onClick={generateSalt}
                  >
                    Generate Salt
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* predictAddress */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Predicted Address</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <span>{predictedAddress || 'null'}</span>
                <div className="static top-0 right-0">
                  <button
                    className="flex items-center cursor-pointer text-blue-navy"
                    onClick={predictAddress}
                  >
                    Predict Address
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* setupContracts */}
          <div className="grid grid-cols-12 gap-5 group relative items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Contract Addresses</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex justify-between">
                <span className="w-full flex flex-col justify-between">
                  {contractAddresses
                    ? contractAddresses.map((address, i) => (
                        <div key={i}>{address}</div>
                      ))
                    : 'null'}
                </span>
                <div className="static top-0 right-0">
                  <button
                    className="flex items-center cursor-pointer text-blue-navy text-right"
                    onClick={createSetupParams}
                  >
                    Create Setup Params
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* data */}
          <div className="grid grid-cols-12 gap-5 group relative  items-center">
            <div className="col-span-4">
              <div className="text-base text-gray-syn4">Encoded Functions</div>
            </div>
            <div className="col-span-8">
              <div className="w-full flex flex-col justify-between overflow-auto">
                {encodedFunctions
                  ? encodedFunctions.map((fxn, i) => <div key={i}>{fxn}</div>)
                  : 'null'}
              </div>
            </div>
          </div>

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
