import { ContractUI } from '@/containers/remix/shared/ContractUI';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { Switch } from '@/components/switch';
import Image from 'next/image';
import { B3, B4, H4 } from '@/components/typography';
import { IActiveNetwork } from '@/state/wallet/types';
import { useQuery, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Callout, CalloutType } from '@/components/callout';
import { Module } from '@/types/modules';
import { useRouter } from 'next/router';
import { getNetworkByName } from '@/helpers/getNetwork';

interface RemixContractsContainerProps {
  collectiveAddress: string;
  activeNetwork: IActiveNetwork;
}

// lift this up to parent component if need to get activeModules for club
const ACTIVEMODULES = gql`
  query SyndicateCollective($syndicateCollectiveId: ID!) {
    syndicateCollective(id: $syndicateCollectiveId) {
      activeModules {
        contractAddress
      }
    }
  }
`;

export const RemixContractsContainer: React.FC<
  RemixContractsContainerProps
> = ({ collectiveAddress, activeNetwork }: RemixContractsContainerProps) => {
  const [activeModules, setActiveModules] = useState<Module[]>([]);
  const [hardCodedModules, setHardcodedeModules] = useState(false);

  const router = useRouter();
  const query = router.query;
  // decoded txn values
  const [decodedChainId, setDecodedChainId] = useState<number>();
  const [decodedFnName, setDecodedFnName] = useState('');
  const [encodedFnParams, setEncodedFnParams] = useState<string | string[]>();

  //TODO: conditionally query only if right permissions? hide if member?
  const { loading, data } = useQuery(ACTIVEMODULES, {
    variables: {
      syndicateCollectiveId: collectiveAddress?.toLocaleLowerCase()
    },
    context: {
      clientName: 'theGraph',
      chainId: activeNetwork?.chainId
    },
    notifyOnNetworkStatusChange: true,
    skip: !collectiveAddress || !activeNetwork.chainId,
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    if (data?.syndicateCollective && !decodedFnName) {
      setActiveModules(data.syndicateCollective?.activeModules ?? []);
    }
    if (hardCodedModules) {
      activeNetwork?.chainId == 1
        ? setActiveModules([
            { contractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' },
            { contractAddress: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB' }
          ])
        : activeNetwork?.chainId == 5
        ? setActiveModules([
            { contractAddress: '0xf712457C8DDAb398A55A53dAD80852902DD89750' },
            { contractAddress: '0xf4910C763eD4e47A585E2D34baA9A4b611aE448C' }
          ])
        : setActiveModules([]);
    }
  }, [loading, hardCodedModules, activeNetwork]);

  useEffect(() => {
    if (!query) {
      return;
    }
    const { contractAddress, fn, chain, fnParams } = query;

    setDecodedFnName(fn as string);
    setActiveModules([{ contractAddress: contractAddress as string }]);
    const chainNetwork = getNetworkByName(chain);
    setDecodedChainId(chainNetwork.chainId);
    setEncodedFnParams(fnParams);
  }, [query]);

  // TODO:
  // [PRO2-53] gasEstimate for funcABI transactions
  // [PRO2-52][DES-1041] handle displaying inputs, input validation, transaction progress + results
  // refactor + remove unneeded

  return (
    <>
      <div className="flex mb-3">
        <Image
          src={'/images/remix/remix-gradient.svg'}
          width={71}
          height={20}
          objectFit="contain"
        />
        <H4 extraClasses="ml-2 font-normal">playground</H4>
      </div>
      <Callout
        type={CalloutType.WARNING}
        showIcon={false}
        extraClasses="p-4 rounded-2xl mb-3"
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
            necessarily do what they say they do.
          </B4>
        </div>
      </Callout>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-syn4">Use hardcoded</div>
        <Switch
          isOn={hardCodedModules}
          onClick={() => setHardcodedeModules(!hardCodedModules)}
        />
      </div>
      {loading ? (
        <SkeletonLoader width="100%" height="14" borderRadius="rounded-full" />
      ) : (
        activeModules?.map((activeModule, i: number) => {
          return (
            <ContractUI
              contractAddress={activeModule?.contractAddress}
              chainId={decodedChainId || activeNetwork.chainId}
              index={i}
              key={`${i}-${activeModule?.contractAddress}`}
              decodedFnName={decodedFnName}
              encodedFnParams={encodedFnParams}
            />
          );
        })
      )}
    </>
  );
};
