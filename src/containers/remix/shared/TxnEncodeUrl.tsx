/* eslint-disable jsx-a11y/anchor-is-valid */
import { getNetworkById } from '@/helpers/getNetwork';
import { FunctionFragment } from 'ethers/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { computeEncodedUrl } from './encodeParams';

interface TxnEncodeUrlProps {
  fn: string;
  chainId: number;
  contractAddress: string;
  fnParams: Record<string, any>;
  abiLeaf: FunctionFragment;
  mode: 'remix' | '';
  inputsValid: boolean;
}

const TxnEncodeUrl: React.FC<TxnEncodeUrlProps> = ({
  fn,
  chainId,
  contractAddress,
  fnParams,
  abiLeaf,
  mode,
  inputsValid
}: TxnEncodeUrlProps) => {
  const [url, setUrl] = useState('');
  const network = getNetworkById(chainId);
  useEffect(() => {
    if (!window.location) return;
    const location = window.location.href;
    const [prefix, after] = location.split('?');
    setUrl(
      computeEncodedUrl(
        {
          mode,
          chainName: network?.network as string,
          fn,
          contractAddress,
          fnParams: fnParams,
          abiLeaf
        },
        prefix,
        after
      )
    );
  }, [abiLeaf, contractAddress, fn, fnParams, mode, network?.network]);
  return (
    <>
      {inputsValid && (
        <Link href={url} passHref>
          <a target="_blank" rel="noreferrer">
            <p className="break-words">{url}</p>
          </a>
        </Link>
      )}
    </>
  );
};

export default TxnEncodeUrl;
