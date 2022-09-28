import { InputField } from '@/components/inputField';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { FuncInput } from '@/types/remix';
import { FunctionFragment } from 'ethers/lib/utils';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { Callout, CalloutType } from '../../../components/callout';
import Modal, { ModalStyle } from '../../../components/modal';
import { B2, B3, B4, H3 } from '../../../components/typography';
import TxnEncodeUrl from './TxnEncodeUrl';
import { ProgressCard, ProgressState } from '@/components/progressCard';

interface AbiFnModalProps {
  showAbiFnModal: boolean;
  handleModalClose: () => void;
  clickCallback: (
    abi: any,
    abiFunction: FunctionFragment | undefined,
    inputsValues: string[] | undefined,
    lookupOnly?: boolean
  ) => void;
  contractAddress: string;
  chainId: number;
  abi: any;
  funcABI: FunctionFragment;
  stringInputs: string;
  lookupOnly: boolean;
  txnProgress?: {
    progressStatus: ProgressState;
    progressTitle?: string;
    progressDescription?: string;
    txnHash?: string;
  };
  mode?: 'decoded' | 'admin';
  encodedFnParams?: string | string[];
  response?: any;
}

const AbiFnModal: React.FC<AbiFnModalProps> = ({
  showAbiFnModal,
  handleModalClose,
  clickCallback,
  contractAddress,
  chainId,
  abi,
  funcABI,
  stringInputs,
  lookupOnly,
  mode,
  encodedFnParams,
  response,
  txnProgress
}: AbiFnModalProps) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const [fnParams, setFnParams] = useState<
    Record<string, string | number | boolean>
  >({});
  const [isTransactionDisabled] = useState(false);

  useEffect(() => {
    let params: string[] = [];
    if (typeof encodedFnParams == 'string') {
      params = encodedFnParams.split(',');
    } else if (Array.isArray(encodedFnParams)) {
      params = encodedFnParams;
    }

    if (params.length == funcABI.inputs.length) {
      // assumes params are in order of funcAbi
      funcABI.inputs.forEach((inp, i) => {
        setFnParams((oldParams) => ({
          ...oldParams,
          [inp.name]: params[i]
        }));
      });
    }
  }, [encodedFnParams]);

  const cleanupInputValue = (value: string): string =>
    value
      .trim()
      .replace(/^["|']/, '')
      .replace(/["|']$/, '');

  const getMultiValsString = (
    fields: Record<string, any>
  ): string[] | undefined => {
    const entries = Object.entries(fields);
    let ret = '';
    const valArrayTest: string[] = [];

    for (let j = 0; j < entries.length; j++) {
      if (ret !== '') ret += ',';
      const elVal = entries[j] ? entries[j][1] : '';

      // valArrayTest.push(elVal);
      // elVal = elVal.replace(/(^|,\s+|,)(\d+)(\s+,|,|$)/g, '$1"$2"$3'); // replace non quoted number by quoted number
      // elVal = elVal.replace(
      //   /(^|,\s+|,)(0[xX][0-9a-fA-F]+)(\s+,|,|$)/g,
      //   '$1"$2"$3'
      // ); // replace non quoted hex string by quoted hex string
      // if (elVal) {
      //   try {
      //     JSON.parse(elVal);
      //   } catch (e) {
      //     elVal = '"' + elVal + '"';
      //   }
      // }
      ret += elVal;

      valArrayTest.push(elVal.toString());
    }
    const valStringTest = valArrayTest.join('');

    if (valStringTest) {
      // return ret;
      return valArrayTest;
    } else {
      return undefined;
    }
  };

  const handleExpandMultiClick = () => {
    const valsString = getMultiValsString(fnParams);
    clickCallback(abi, funcABI, valsString, lookupOnly);
  };

  // TODO: pending flow - handle showing connectWallet?

  return (
    <Modal
      show={showAbiFnModal}
      modalStyle={ModalStyle.DARK}
      showCloseButton={false}
      customWidth={'w-full max-w-568'}
      outsideOnClick={true}
      closeModal={handleModalClose}
      customClassName={'p-5'}
    >
      <>
        <div className="flex items-center mb-2">
          <div className="flex">
            <Image
              src={'/images/remix/remix-gray.svg'}
              width={52}
              height={12}
              objectFit="contain"
            />
          </div>
          <B2 extraClasses="ml-2 font-normal text-gray-syn4">custom module</B2>
        </div>

        <H3 extraClasses="font-normal">
          {`${funcABI.name}${stringInputs ? ': ' + stringInputs : ''}`}
        </H3>
        <div className="flex justify-center mt-4">
          <a
            href={`${activeNetwork?.blockExplorer?.baseUrl}/address/${contractAddress}#code`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className={`flex items-center justify-center space-x-2 border-1 border-gray-syn7 rounded-full py-3 px-6 mb-7`}
            >
              <Image
                src={'/images/eye-icon.svg'}
                width={16}
                height={10}
                objectFit="contain"
              />
              <B2 extraClasses="ml-2">{'View full code on Etherscan'}</B2>
            </button>
          </a>
        </div>

        <Callout
          type={CalloutType.WARNING}
          showIcon={false}
          extraClasses="p-4 rounded-2xl mb-8 mt-2"
        >
          <div className="p-0.5">
            <div className="flex align-items-center mb-2">
              <Image
                src={'/images/syndicateStatusIcons/warning-triangle-yellow.svg'}
                objectFit="contain"
                height={14.5}
                width={16}
              />
              <B3 extraClasses="font-semibold ml-3">
                Exercise caution with custom modules
              </B3>
            </div>
            <B4 extraClasses="mt-1">
              These modules haven’t been verified by Syndicate. They don’t
              necessarily do what they say they do. Titles are user-defined.
              Make sure you trust the source and verify smart contract code
              above.
            </B4>
          </div>
        </Callout>
        {mode !== 'decoded' && (
          <TxnEncodeUrl
            fn={funcABI.name}
            chainId={chainId}
            contractAddress={contractAddress}
            fnParams={fnParams}
            abiLeaf={funcABI}
            mode={'remix'}
            inputsValid={!isTransactionDisabled}
          />
        )}
        <div
          className={`${
            !(funcABI.inputs && funcABI.inputs.length > 0) ? 'hidden' : ''
          }`}
        >
          <div>
            {funcABI.inputs.map((inp: FuncInput, index: number) => {
              const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
                const newValue = cleanupInputValue(e.target.value);
                setFnParams((oldParams) => ({
                  ...oldParams,
                  [inp.name]: newValue
                }));
              };

              return (
                <div className="mt-2" key={index}>
                  {inp.name && <B2>{inp.name}</B2>}
                  <InputField
                    value={fnParams[inp.name]?.toString()}
                    onChange={handleChange}
                    placeholder={inp.type}
                    extraClasses="mt-2"
                    // isInErrorState={}
                    // infoLabel={}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {response && <p>{`res: ${response}`}</p>}
        {txnProgress && (
          <ProgressCard
            state={txnProgress.progressStatus}
            title={txnProgress?.progressTitle ?? ''}
            description={txnProgress?.progressDescription}
          />
        )}
        <div className="flex w-full mt-2 transform hover:-translate-y-0.5 hover:scale-104 transition-all duration-500 relative">
          <button
            className={`${
              isTransactionDisabled
                ? 'primary-CTA-disabled text-gray-syn4'
                : 'primary-CTA'
            } w-full flex ease-in-out justify-center py-4 border text-base rounded-full leading-5.75`}
            disabled={isTransactionDisabled}
            onClick={handleExpandMultiClick}
          >
            {lookupOnly ? 'call' : 'transact'}
          </button>
        </div>
      </>
    </Modal>
  );
};

export default AbiFnModal;
