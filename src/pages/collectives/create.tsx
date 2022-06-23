/**
 * TODO: This file is for test purposes only
 */
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { InputField } from '@/components/inputs/inputField';
import { AppState } from '@/state';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const CollectivesView: React.FC = () => {
  const {
    initializeContractsReducer: {
      syndicateContracts: { erc721CollectiveFactory }
    },
    web3Reducer: {
      web3: { account, web3, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const [collectiveName, setCollectiveName] =
    useState<string>('Alpha Beta Punks');
  const [collectiveSymbol, setCollectiveSymbol] = useState<string>('ABP');
  const [salt, setSalt] = useState<number>();
  const [contractAddresses, setContractAddresses] = useState<string[]>();
  const [encodedFunctions, setEncodedFunctions] = useState<string[]>();
  const [predictedAddress, setPredictedAddress] = useState<string>();
  const [gasPrice, setGasPrice] = useState<number>(0);

  const generateSalt = () => {
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

  const createCollective = async () => {
    console.log({
      account,
      collectiveName,
      collectiveSymbol,
      salt,
      contractAddresses,
      encodedFunctions
    });

    erc721CollectiveFactory.createERC721Collective(
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

  const getEstimateGas = () => {
    erc721CollectiveFactory.getEstimateGas(account, setGasPrice);
  };

  const onTxConfirm = (txn: unknown) => {
    console.log({ txn });
  };

  const onTxReceipt = (receipt: unknown) => {
    console.log({ receipt });
  };

  const onTxFail = (error: unknown) => {
    console.log({ error });
  };

  return (
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
              <InputField value={collectiveName} onChange={setCollectiveName} />
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
        <div className="grid grid-cols-12 gap-5 group relative  items-center">
          <div className="col-span-4">
            <div className="text-base text-gray-syn4">Contract Addresses</div>
          </div>
          <div className="col-span-8">
            <div className="w-full flex flex-col justify-between">
              {contractAddresses
                ? contractAddresses.map((address, i) => (
                    <div key={i}>{address}</div>
                  ))
                : 'null'}
            </div>
          </div>
        </div>

        {/* data */}
        <div className="grid grid-cols-12 gap-5 group relative  items-center">
          <div className="col-span-4">
            <div className="text-base text-gray-syn4">Encoded Functions</div>
          </div>
          <div className="col-span-8">
            <div className="w-full flex flex-col justify-between">
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
  );
};

export default CollectivesView;
