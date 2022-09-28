import { SkeletonLoader } from '@/components/skeletonLoader';
import { getInputs, shortenAddress, sortAbiFunction } from '@/utils/remix';
import { toChecksumAddress } from 'ethereumjs-util';
import { FunctionFragment, isAddress } from 'ethers/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import AbiUI from './AbiUI';
import AbiFnModal from './AbiFnModal';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { isEmpty } from 'lodash';
import { getGnosisTxnInfo } from '@/ClubERC20Factory/shared/gnosisTransactionInfo';
import { estimateGas } from '@/ClubERC20Factory/shared/getGasEstimate';
import getSupportedAbi, { SupportedAbi } from '@/helpers/getSupportedAbi';
import { ProgressState } from '@/components/progressCard';

interface ContractUIProps {
  contractAddress: string;
  chainId: number;
  index: number;
  decodedFnName?: string;
  encodedFnParams?: string | string[];
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
  decodedFnName,
  encodedFnParams
}: ContractUIProps) => {
  const [abi, setAbi] = useState<any>();
  const [contractName, setContractName] = useState('');
  const [validContractAddress, setValidContractAddress] = useState('');
  const [invalidResponse, setInvalidResponse] = useState('');
  const [isUnverified, setUnverified] = useState<boolean>(false);

  // abiFnModal
  const [showFnModal, setShowFnModal] = useState(true);
  const [fnFragment, setFnFragment] = useState<FunctionFragment>();
  const [lookupOnly, setLookupOnly] = useState(false);
  const [inputs, setInputs] = useState('');

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
      setInputs(getInputs(abiLeaf));
    }
  }, [decodedFnName, abi, loading]);

  const toggleShowDecodeModal = (): void => {
    setShowFnModal(!showFnModal);
  };

  const onResponse = (res: any) => {
    setCallResponse(res);
  };

  const onTxConfirm = (txn: string) => {
    console.log('txn', txn);
    setTransactionHash(txn);
    setProgressTitle('Approving');
    setProgressDescription(
      'This could take anywhere from seconds to hours depending on network congestion and gas fees. You can safely leave this page while you wait.'
    );
    setProgressStatus(ProgressState.PENDING);
  };

  const onTxReceipt = (receipt: any) => {
    console.log('receipt', receipt);
    setProgressTitle('Transaction successful');
    setProgressDescription('');
    setProgressStatus(ProgressState.SUCCESS);
  };

  const onTxFail = (err: any) => {
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
      callCb(`${err}`);
    }
  };

  return (
    <div key={`${index}-${data}`} className={`${index > 0 ? 'mt-2' : ''}`}>
      {fnFragment && (
        <AbiFnModal
          showAbiFnModal={showFnModal}
          handleModalClose={toggleShowDecodeModal}
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
          funcABI={fnFragment}
          chainId={chainId}
          stringInputs={inputs}
          lookupOnly={lookupOnly}
          txnProgress={
            progressStatus && {
              progressStatus,
              progressTitle,
              progressDescription,
              txnHash: transactionHash
            }
          }
          mode={decodedFnName ? 'decoded' : 'admin'}
          encodedFnParams={encodedFnParams}
          response={callResponse}
        />
      )}
      {!decodedFnName &&
        (loading ? (
          <SkeletonLoader
            width="100%"
            height="14"
            borderRadius="rounded-full"
          />
        ) : invalidResponse ? (
          <p>{invalidResponse}</p>
        ) : (
          <div className="flex w-full max-w-88 justify-center border-1 border-gray-syn7 rounded-2xl px-4 py-5">
            {!isUnverified ? (
              <AbiUI
                key={validContractAddress}
                instance={{
                  address: validContractAddress,
                  chainId: chainId,
                  name: contractName,
                  abi: abi
                }}
                setFnFragment={setFnFragment}
                setFnLookupOnly={setLookupOnly}
                setShowFnModal={setShowFnModal}
              />
            ) : (
              <div>
                <p>Contract source code not verified for </p>
                <a
                  href={`https://etherscan.io/address/${contractAddress}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p>
                    {isAddress(contractAddress)
                      ? shortenAddress(toChecksumAddress(contractAddress), 14)
                      : contractAddress}
                  </p>
                </a>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
