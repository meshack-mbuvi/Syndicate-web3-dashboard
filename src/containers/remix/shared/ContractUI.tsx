import { SkeletonLoader } from '@/components/skeletonLoader';
import { sortAbiFunction } from '@/utils/remix';
import { toChecksumAddress } from 'ethereumjs-util';
import { FunctionFragment, isAddress } from 'ethers/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import AbiUI from './AbiUI';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { getGnosisTxnInfo } from '@/ClubERC20Factory/shared/gnosisTransactionInfo';
import { estimateGas } from '@/ClubERC20Factory/shared/getGasEstimate';
import getSupportedAbi, { SupportedAbi } from '@/helpers/getSupportedAbi';
import { ProgressState } from '@/components/progressCard';
import { useRouter } from 'next/router';
import DecodedFnModal from './modalSteps/DecodedFnModal';

interface ContractUIProps {
  contractAddress: string;
  chainId: number;
  index: number;
  isActiveModule: boolean;
  isAdmin: boolean;
  name: string;
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
  index,
  isActiveModule,
  name,
  // isAdmin,
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
  const [showFnModal, setShowFnModal] = useState(false);
  const [fnFragment, setFnFragment] = useState<FunctionFragment | null>();
  const [lookupOnly, setLookupOnly] = useState(false);

  // res + txn + err
  const [callResponse, setCallResponse] = useState('');
  const [progressStatus, setProgressStatus] = useState<ProgressState>();
  const [progressTitle, setProgressTitle] = useState<string>();
  const [progressDescription, setProgressDescription] = useState<string>();
  const [transactionHash, setTransactionHash] = useState<string>();

  const {
    web3Reducer: {
      web3: { web3, account, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const supportedAbi = useMemo((): SupportedAbi | null => {
    const supported = getSupportedAbi(contractAddress, activeNetwork?.chainId);
    if (supported && typeof supported !== 'string') {
      return { abi: supported.abi, contractName: supported.contractName };
    } else {
      return null;
    }
  }, [activeNetwork?.chainId, contractAddress]);

  const { loading, data } = useQuery(CONTRACT_DETAILS, {
    variables: {
      chainId,
      contractAddress
    },
    context: { clientName: 'backend', chainId },
    notifyOnNetworkStatusChange: true,
    skip: !contractAddress || !chainId || !!supportedAbi,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (loading) return;

    if (!data?.contractDetails && !loading && !supportedAbi) {
      setInvalidResponse('Unable to find abi');
    } else {
      setInvalidResponse('');

      if (supportedAbi) {
        setAbi(supportedAbi.abi);
        setContractName(supportedAbi.contractName);
      } else {
        if (data?.contractDetails?.abi == 'Contract source code not verified') {
          setUnverified(true);
        } else {
          setUnverified(false);
          setContractName(data?.contractDetails?.contractName);
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
      const lookupOnly =
        abiLeaf.stateMutability === 'view' ||
        abiLeaf.stateMutability === 'pure' ||
        isConstant;
      setLookupOnly(lookupOnly);
      setShowFnModal(true);
    }
  }, [decodedFnName, abi, loading]);

  const clearParams = (): void => {
    if (!router.isReady) return;
    const { chain, clubAddress, collectiveAddress } = router.query;
    router.push({
      pathname: router.pathname,
      query: {
        ...(clubAddress && { clubAddress: clubAddress }),
        ...(collectiveAddress && { collectiveAddress: collectiveAddress }),
        chain: chain
      }
    });
  };

  const clearCallResponse = (): void => {
    setCallResponse('');
  };

  const toggleShowFnModal = (): void => {
    setShowFnModal(!showFnModal);
    setFnFragment(null);
    clearCallResponse();
    clearParams();
  };

  const onResponse = (res: any): void => {
    setCallResponse(res);
  };

  const onTxConfirm = (txn: string): void => {
    console.log('txn', txn);
    setTransactionHash(txn);
    setProgressTitle('Approving');
    setProgressDescription(
      'This could take anywhere from seconds to hours depending on network congestion and gas fees. You can safely leave this page while you wait.'
    );
    setProgressStatus(ProgressState.PENDING);
  };

  const onTxReceipt = (receipt: any): void => {
    console.log('receipt', receipt);
    setProgressTitle('Transaction successful');
    setProgressDescription('');
    setProgressStatus(ProgressState.SUCCESS);
  };

  const onTxFail = (err: any): void => {
    console.log('err', err);
    setProgressTitle('Transaction Failed');
    setProgressStatus(ProgressState.FAILURE);
  };

  const runTransaction = async (
    abi: JSON,
    abiFunction: FunctionFragment | undefined,
    inputsValues: string[] | undefined,
    callCb: (res: any) => void,
    confirmationCb: (txn: any) => void,
    receiptCb: (receipt: any) => void,
    failCb: (err: any) => void,
    lookupOnly?: boolean
  ) => {
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
      if (lookupOnly) {
        res = await contract.methods[functionName](
          ...(inputsValues || [])
        ).call();
        callCb(res);
      } else {
        const gasEstimate = await estimateGas(web3);

        await new Promise((resolve, reject) => {
          contract.methods[functionName](...(inputsValues || []))
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
        callCb(err);
      } else if (err instanceof Error) {
        callCb(err.message);
      }
    }
  };

  return (
    <div key={`${index}-${data}`}>
      {/* decoded function view (most likely a member but can be an admin */}
      {fnFragment && decodedFnName ? (
        <DecodedFnModal
          showDecodedFnModal={showFnModal}
          name={name}
          isSyndicateSupported={supportedAbi ? true : false}
          handleModalClose={toggleShowFnModal}
          clearResponse={clearCallResponse}
          clickCallback={(
            abi: any,
            abiFunction: FunctionFragment | undefined,
            inputsValues: string[] | undefined,
            lookupOnly?: boolean
          ): void => {
            runTransaction(
              abi,
              abiFunction,
              inputsValues,
              onResponse,
              onTxConfirm,
              onTxReceipt,
              onTxFail,
              lookupOnly
            );
          }}
          contractAddress={contractAddress}
          abi={abi}
          moduleName={contractName}
          funcABI={fnFragment}
          chainId={chainId}
          lookupOnly={lookupOnly}
          txnProgress={
            progressStatus && {
              progressStatus,
              progressTitle,
              progressDescription,
              txnHash: transactionHash
            }
          }
          encodedFnParams={encodedFnParams}
          response={callResponse}
        />
      ) : loading ? (
        <SkeletonLoader width="355" height="32" borderRadius="rounded-full" />
      ) : !searchValue || contractName?.toLowerCase()?.includes(searchValue) ? (
        <AbiUI
          key={validContractAddress}
          instance={{
            address: validContractAddress,
            chainId: chainId,
            name: contractName,
            abi: abi,
            isSyndicateSupported: supportedAbi ? true : false,
            isActive: isActiveModule,
            isUnverified: isUnverified,
            invalidResponse: invalidResponse
          }}
          showFnModal={showFnModal}
          setShowFnModal={setShowFnModal}
          handleToggleModal={toggleShowFnModal}
          setFnFragment={setFnFragment}
          setFnLookupOnly={setLookupOnly}
          clearResponse={clearCallResponse}
          selectedFnFragment={fnFragment}
          selectedLookupOnly={lookupOnly}
        />
      ) : null}
    </div>
  );
};
