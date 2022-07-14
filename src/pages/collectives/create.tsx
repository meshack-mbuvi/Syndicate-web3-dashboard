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

// Factory
// const factoryAddress = '0xe16d032f1cf5974cf8d1985278b464ed91220733';

// Fixed Renderer
const fixedRenderer = '0x6c4f220416751503e81e38deee9899082a803275';

// Guard
const mintGuard = '0xe868fa053925fe8bce31fc7d5272c4b4aa82477b';

// Modules
const ethPriceModule = '0x89583ad6aba72c7c6de70ee9a290884abc4000c3';
// const ownerMintModule = '0x60bfff0B6e064673B61f3eB9dEA5ED0f3BbB5471';

// Mixins
const timeMixin = '0x723541996f751ea24608e9de75488746a067d61b';
const maxPerWalletMixin = '0x487e27ae8b6f68719eb64d46b5fe81bb04e28c46';
const totalSupplyMixin = '0x50ab2de08f81522fffe1156af22374d37222e14f';
const mixins = [timeMixin, maxPerWalletMixin, totalSupplyMixin];

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

  const [salt, setSalt] = useState<number>();
  const [contractAddresses, setContractAddresses] = useState<string[]>([]);
  const [encodedFunctions, setEncodedFunctions] = useState<string[]>([]);
  const [predictedAddress, setPredictedAddress] = useState<string>();
  const [txn, setTxn] = useState<string>();

  const { gasPrice, getEstimateGas } = useGasEstimate();

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
    const _contractAddresses = [
      timeMixin,
      totalSupplyMixin,
      maxPerWalletMixin,
      mintGuard,
      mintGuard,
      ethPriceModule,
      fixedRenderer
    ];

    const _encodedFunctions = [
      erc721CollectiveFactory.setTimeRequirements(
        predictedAddress,
        '0',
        '1684952525'
      ),
      erc721CollectiveFactory.setTotalSupplyRequirements(
        predictedAddress,
        10000
      ),
      erc721CollectiveFactory.setMaxPerMemberRequirements(predictedAddress, 3),
      erc721CollectiveFactory.updateDefaultMixins(predictedAddress, mixins),
      erc721CollectiveFactory.allowModule(predictedAddress, ethPriceModule),
      erc721CollectiveFactory.updateEthPrice(
        predictedAddress,
        web3.utils.toWei('0.5')
      ),
      erc721CollectiveFactory.updateTokenURI(predictedAddress, 'ipfs://hash')
    ];

    setContractAddresses(_contractAddresses);
    setEncodedFunctions(_encodedFunctions);
  };

  const createCollective = async () => {
    await erc721CollectiveFactory.createERC721Collective(
      account,
      collectiveName,
      collectiveSymbol,
      salt,
      contractAddresses,
      encodedFunctions,
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
