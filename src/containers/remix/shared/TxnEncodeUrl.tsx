import CopyLink from '@/components/shared/CopyLink';
import { getNetworkById } from '@/helpers/getNetwork';
import { FunctionFragment } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import { computeEncodedUrl } from './encodeParams';

interface TxnEncodeUrlProps {
  fn: string;
  chainId: number;
  contractAddress: string;
  fnParams: Record<string, any>;
  abiLeaf: FunctionFragment;
  mode: 'remix' | '';
}

const TxnEncodeUrl: React.FC<TxnEncodeUrlProps> = ({
  fn,
  chainId,
  contractAddress,
  fnParams,
  abiLeaf,
  mode
}: TxnEncodeUrlProps) => {
  const [url, setUrl] = useState('');
  const network = getNetworkById(chainId);
  const [showDepositLinkCopyState, setShowDepositLinkCopyState] =
    useState<boolean>(false);

  const updateDepositLinkCopyState = () => {
    setShowDepositLinkCopyState(true);
    setTimeout(() => setShowDepositLinkCopyState(false), 1000);
  };
  useEffect(() => {
    if (!window.location) return;
    const location = window.location.href;
    const [prefix, after] = location.split('?');
    const cleanPrefix = prefix.replace('/manage', '');

    setUrl(
      computeEncodedUrl(
        {
          mode,
          fn,
          contractAddress,
          fnParams: fnParams,
          abiLeaf
        },
        cleanPrefix,
        after
      )
    );
  }, [abiLeaf, contractAddress, fn, fnParams, mode, network?.network]);
  return (
    <CopyLink
      link={url}
      updateCopyState={updateDepositLinkCopyState}
      showCopiedState={showDepositLinkCopyState}
      showBanner={false}
      accentColor="white"
      backgroundColor="bg-black"
      borderColor="border-none"
      borderRadius="rounded-2xl"
      copyBorderRadius="rounded-lg"
    />
  );
};

export default TxnEncodeUrl;
