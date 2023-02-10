import { estimateGas } from '@/ClubERC20Factory/shared/getGasEstimate';
import { getGnosisTxnInfo } from '@/ClubERC20Factory/shared/gnosisTransactionInfo';
import { ProgressState } from '@/components/progressCard';
import { ProgressModal } from '@/components/progressModal';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { M2 } from '@/components/typography';
import getSupportedAbi, {
  SupportedAbiDetails,
  SupportedAbiError
} from '@/helpers/getSupportedAbi';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { AppState } from '@/state';
import { getInputs, sortAbiFunction } from '@/utils/remix';
import { gql, useQuery } from '@apollo/client';
import { toChecksumAddress } from 'ethereumjs-util';
import { FunctionFragment, isAddress } from 'ethers/lib/utils';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AbiItem } from 'web3-utils';
import AbiUI from './AbiUI';
import { parseValue } from './encodeParams';
import DecodedFnModal from './modalSteps/DecodedFnModal';

interface ContractUIProps {
  contractAddress: string;
  chainId: number;
  isActiveModule: boolean;
  isAdmin: boolean;
  name: string;
  entityType: 'club' | 'collective';
  entityAddress: string;
  decodedFnName?: string;
  encodedFnParams?: string | string[];
  searchValue?: string;
}

export const CONTRACT_DETAILS = gql`
  query ContractDetails($chainId: Int!, $contractAddress: String!) {
    contractDetails(chainId: $chainId, contractAddress: $contractAddress) {
      contractAddress
      chainId
      abi
      compilerVersion
      contractName
      sourceCode
    }
  }
`;

export const ContractUI: React.FC<ContractUIProps> = ({
  contractAddress,
  chainId,
  isActiveModule,
  name,
  entityType,
  entityAddress,
  decodedFnName,
  encodedFnParams,
  searchValue
}: ContractUIProps) => {
  const [abi, setAbi] = useState<any>();
  const [contractName, setContractName] = useState('');
  const [validContractAddress, setValidContractAddress] = useState('');
  const [invalidResponse, setInvalidResponse] = useState('');
  const [isUnverified, setUnverified] = useState<boolean>(false);

  // abiFnModal
  const [fnFragment, setFnFragment] = useState<FunctionFragment | null>(null);
  const [isLookupOnly, setLookupOnly] = useState(false);
  // res + txn + err
  const [progressStatus, setProgressStatus] = useState<ProgressState | null>(
    null
  );
  const [hasError, setHasError] = useState(false);
  const [progressTitle, setProgressTitle] = useState<string>();
  const [progressDescription, setProgressDescription] = useState<
    string | ReactNode
  >();
  const [transactionHash, setTransactionHash] = useState<string>();

  const {
    web3Reducer: {
      web3: { web3, account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const router = useRouter();

  const conditionallySupported =
    entityType === 'collective' &&
    contractAddress.toLowerCase() === entityAddress.toLowerCase()
      ? CONTRACT_ADDRESSES[
          activeNetwork?.chainId as keyof typeof CONTRACT_ADDRESSES
        ].ERC721Collective
      : contractAddress;
  const supportedAbi: SupportedAbiDetails | SupportedAbiError = useMemo(
    () => getSupportedAbi(conditionallySupported, activeNetwork?.chainId),
    [activeNetwork?.chainId, contractAddress]
  );

  const { loading, data } = useQuery<{
    contractDetails: { abi?: string; contractName?: string };
  }>(CONTRACT_DETAILS, {
    variables: {
      chainId,
      contractAddress
    },
    context: { clientName: 'backend', chainId },
    notifyOnNetworkStatusChange: true,
    skip: !contractAddress || !chainId,
    fetchPolicy: 'no-cache'
  });

  const clearParams = (): void => {
    if (!router.isReady) return;
    const { chain, clubAddress, collectiveAddress } = router.query;
    void router.push({
      pathname: router.pathname,
      query: {
        ...(clubAddress && { clubAddress: clubAddress }),
        ...(collectiveAddress && { collectiveAddress: collectiveAddress }),
        chain: chain
      }
    });
  };

  useEffect(() => {
    if (loading) return;

    if (!data?.contractDetails && !loading && !supportedAbi) {
      setInvalidResponse('Unable to find abi');
    } else {
      setInvalidResponse('');

      if (typeof supportedAbi !== 'string') {
        setAbi(supportedAbi.abi);
        setContractName(supportedAbi.contractName);
        setUnverified(false);
      } else {
        if (data?.contractDetails?.abi == 'Contract source code not verified') {
          setUnverified(true);
        } else {
          setUnverified(false);
          setContractName(data?.contractDetails?.contractName ?? '');
          setAbi(
            data?.contractDetails?.abi &&
              sortAbiFunction(JSON.parse(data.contractDetails?.abi))
          );
        }
      }
      if (isAddress(contractAddress)) {
        setValidContractAddress(toChecksumAddress(contractAddress));
      }
    }
  }, [data, supportedAbi, contractAddress, loading]);

  useEffect(() => {
    if (!abi || loading || !decodedFnName) return;

    const abiLeaf = abi.find((leaf: any) => leaf.name === decodedFnName);

    if (abiLeaf) {
      setFnFragment(abiLeaf);
      const isConstant =
        abiLeaf.constant !== undefined ? abiLeaf.constant : false;
      const isLookupOnly =
        abiLeaf.stateMutability === 'view' ||
        abiLeaf.stateMutability === 'pure' ||
        isConstant;
      setLookupOnly(isLookupOnly);
    }
  }, [decodedFnName, abi, loading]);

  const resetProgress = (): void => {
    setProgressDescription('');
    setProgressStatus(null);
    setProgressTitle('');
    setHasError(false);
  };

  const toggleShowFnModal = (): void => {
    setFnFragment(null);
    resetProgress();
    clearParams();
  };

  const handleFailGoBack = (): void => {
    resetProgress();
  };

  const onResponse = (res: any, isError?: boolean): void => {
    setProgressTitle(isError ? 'Function call failed' : 'Success');
    setProgressDescription(
      <span className="">
        The function{`${isError ? ' call' : ''}`}
        <M2 extraClasses="text-gray-syn3  inline-block">
          <span className="bg-gray-syn7 pb-1 px-2 text-center rounded">
            {`${fnFragment?.name}: ${getInputs(fnFragment)}`}
          </span>
        </M2>
        {!isError
          ? 'was called succesfully and responded with the following:'
          : 'has failed. Please verify that the data inputs are valid.'}
        <p className="mt-6 py-3 px-4 rounded-xl bg-black text-white break-words">
          {res}
        </p>
      </span>
    );
    setProgressStatus(isError ? ProgressState.FAILURE : ProgressState.SUCCESS);
    setHasError(isError ? true : false);
  };

  const onTxConfirm = (txn: string): void => {
    setTransactionHash(txn);
    setProgressTitle('Running function');
    setProgressStatus(ProgressState.PENDING);
  };

  const onTxReceipt = (): void => {
    setProgressTitle('Transaction successful');
    setProgressDescription(
      <span className="">
        The function{' '}
        <M2 extraClasses="text-gray-syn3 inline-block">
          <span className="bg-gray-syn7 pb-1 px-2 text-center rounded">
            {`${fnFragment?.name}: ${getInputs(fnFragment)}`}
          </span>
        </M2>{' '}
        was called successfully.
      </span>
    );
    setProgressStatus(ProgressState.SUCCESS);
  };

  const onTxFail = (err: any): void => {
    setProgressTitle('Transaction failed');
    setProgressStatus(ProgressState.FAILURE);
    setProgressDescription(
      <span className="">
        The function{' '}
        <M2 extraClasses="text-gray-syn3 inline-block">
          <span className="bg-gray-syn7 pb-1 px-2 text-center rounded">
            {`${fnFragment?.name}: ${getInputs(fnFragment)}`}
          </span>
        </M2>{' '}
        has failed. Please verify that the data inputs are valid.
        {err?.message}
      </span>
    );
    setHasError(true);
  };

  // TODO [REMIX]: [PRO2-79] refactor and move to contract
  const runTransaction = async (
    abi: AbiItem | AbiItem[],
    abiFunction: FunctionFragment | null,
    inputsValues: string[] | undefined,
    callCb: (res: any, isError?: boolean) => void,
    confirmationCb: (txn: any) => void,
    receiptCb: (receipt: any) => void,
    failCb: (err: any) => void,
    isLookupOnly?: boolean
  ): Promise<void> => {
    if (isEmpty(web3) || !account || !abiFunction) {
      return;
    }

    const functionName =
      abiFunction.type === 'function'
        ? abiFunction.name
        : `(${abiFunction.type})`;

    const contract = await new web3.eth.Contract(abi, contractAddress);

    let gnosisTxHash;
    let res;
    try {
      if (isLookupOnly) {
        res = await contract.methods[functionName](
          ...(inputsValues || [])
        ).call();
        callCb(res);
      } else {
        const gasEstimate = await estimateGas(web3);
        const parsed = (inputsValues || []).map((v) => parseValue(v));

        await new Promise((resolve, reject) => {
          contract.methods[functionName](...(parsed || []))
            .send({ from: account, gasEstimate: gasEstimate })
            .on('transactionHash', (transactionHash: any) => {
              confirmationCb(transactionHash);

              // Stop waiting if we are connected to gnosis safe via walletConnect
              if (
                web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
              ) {
                setTransactionHash('');
                gnosisTxHash = transactionHash;

                resolve(transactionHash);
              } else {
                setTransactionHash(transactionHash);
              }
            })
            .on('receipt', (receipt: TransactionReceipt) => {
              receiptCb(receipt);
              resolve(receipt);
            })
            .on('error', (error: any) => {
              failCb(error);
              reject(error);
            });
        });

        if (gnosisTxHash) {
          const receipt: any = await getGnosisTxnInfo(
            gnosisTxHash,
            activeNetwork
          );
          onTxConfirm(receipt.transactionHash);
          if (receipt.isSuccessful) {
            receiptCb(receipt);
          } else {
            failCb('Transaction failed');
          }
        }
      }
    } catch (err) {
      if (typeof err === 'string') {
        callCb(err, true);
      } else if (err instanceof Error) {
        callCb(err.message, true);
      }
    }
  };

  return (
    <>
      {progressStatus ? (
        <ProgressModal
          isVisible={true}
          title={progressTitle ?? ''}
          description={progressDescription}
          transactionHash={transactionHash}
          transactionType={'transaction'}
          buttonLabel={
            hasError
              ? 'Go back'
              : progressStatus === ProgressState.PENDING
              ? ''
              : 'Done'
          }
          buttonOnClick={hasError ? handleFailGoBack : toggleShowFnModal}
          closeModal={toggleShowFnModal}
          outsideOnClick={true}
          buttonFullWidth={true}
          state={progressStatus}
        />
      ) : fnFragment && decodedFnName ? (
        <DecodedFnModal
          name={name}
          isSyndicateSupported={supportedAbi ? true : false}
          clickCallback={(
            abi: any,
            abiFunction: FunctionFragment | null,
            inputsValues: string[] | undefined,
            isLookupOnly?: boolean
          ): void => {
            void runTransaction(
              abi,
              abiFunction,
              inputsValues,
              onResponse,
              onTxConfirm,
              onTxReceipt,
              onTxFail,
              isLookupOnly
            );
          }}
          contractAddress={contractAddress}
          isLoading={loading}
          abi={abi}
          moduleName={contractName}
          setFnFragment={setFnFragment}
          fnFragment={fnFragment}
          isLookupOnly={isLookupOnly}
          encodedFnParams={encodedFnParams}
        />
      ) : loading ? (
        <div className="w-full max-w-355">
          <SkeletonLoader
            width="full"
            height="32"
            borderRadius="rounded-2.5xl"
          />
        </div>
      ) : (!searchValue ||
          contractName?.toLowerCase()?.includes(searchValue)) &&
        !(
          typeof supportedAbi !== 'string' && supportedAbi?.type === 'other'
        ) ? (
        <AbiUI
          key={validContractAddress}
          instance={{
            address: validContractAddress,
            chainId: chainId,
            name: contractName,
            abi: abi,
            isSyndicateSupported: supportedAbi ? true : false,
            isActive: isActiveModule,
            description:
              typeof supportedAbi !== 'string' ? supportedAbi?.description : '',
            isUnverified: isUnverified,
            invalidResponse: invalidResponse
          }}
          setFnFragment={setFnFragment}
          fnFragment={fnFragment}
          setFnLookupOnly={setLookupOnly}
          isLookupOnly={isLookupOnly}
          clickCallback={(
            abi: any,
            abiFunction: FunctionFragment | null,
            inputsValues: string[] | undefined,
            isLookupOnly?: boolean
          ): void => {
            void runTransaction(
              abi,
              abiFunction,
              inputsValues,
              onResponse,
              onTxConfirm,
              onTxReceipt,
              onTxFail,
              isLookupOnly
            );
          }}
          selectedFnFragment={fnFragment}
          selectedLookupOnly={isLookupOnly}
        />
      ) : null}
    </>
  );
};
