import { B1, H4 } from '@/components/typography';
import { IActiveNetwork } from '@/state/wallet/types';
import { useEffect, useState } from 'react';
import { Module } from '@/types/modules';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { getNetworkByName } from '@/helpers/getNetwork';
import { SearchInput } from '@/components/inputs';
import { CustomModuleCallout } from './shared/CustomModuleCallout';
import RemixLink from './shared/RemixLink';
import RemixModules from './BrowseRemixModules';
import Image from 'next/image';

const COLLECTIVES_ACTIVEMODULES = gql`
  query SyndicateCollective($syndicateCollectiveId: ID!) {
    syndicateCollective(id: $syndicateCollectiveId) {
      id
      activeModules {
        id
        contractAddress
      }
    }
  }
`;

const CLUBS_ACTIVEMODULES = gql`
  query Syndicate_ActiveModules($syndicateDAOId: ID!) {
    syndicateDAO(id: $syndicateDAOId) {
      id
      activeModules {
        id
        contractAddress
      }
    }
  }
`;

interface RemixContractsContainerProps {
  isAdmin: boolean;
  name: string;
  entityType: 'club' | 'collective';
  contractAddress: string;
  activeNetwork: IActiveNetwork;
}

export const RemixContractsContainer: React.FC<
  RemixContractsContainerProps
> = ({
  isAdmin,
  name,
  entityType,
  contractAddress,
  activeNetwork
}: RemixContractsContainerProps) => {
  const [isRemixEnabled, setRemixEnabled] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');

  const { loading, data } = useQuery<{
    syndicateCollective: { activeModules: Module[] };
  }>(COLLECTIVES_ACTIVEMODULES, {
    variables: {
      syndicateCollectiveId: contractAddress?.toLocaleLowerCase()
    },
    context: {
      clientName: 'theGraph',
      chainId: activeNetwork?.chainId
    },
    notifyOnNetworkStatusChange: true,
    skip: !(entityType == 'collective') || !activeNetwork.chainId,
    fetchPolicy: 'no-cache'
  });

  const { loading: clubLoading, data: clubData } = useQuery<{
    syndicateDAO: { activeModules: Module[] };
  }>(CLUBS_ACTIVEMODULES, {
    variables: {
      syndicateDAOId: contractAddress?.toLocaleLowerCase()
    },
    context: {
      clientName: 'theGraph',
      chainId: activeNetwork?.chainId
    },
    notifyOnNetworkStatusChange: true,
    skip: !(entityType == 'club') || !activeNetwork.chainId,
    fetchPolicy: 'no-cache'
  });

  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (!query) {
      return;
    }
    const { mode } = query;

    if (mode && mode == 'remix') {
      setRemixEnabled(true);
    } else {
      setRemixEnabled(
        localStorage.getItem(`${contractAddress}-adminEnabledRemix`) === 'true'
      );
    }
  }, [query, contractAddress]);

  const activeModules: Module[] = query?.fn
    ? [{ contractAddress: query?.contractAddress as string }]
    : data?.syndicateCollective
    ? data.syndicateCollective?.activeModules ?? []
    : clubData?.syndicateDAO
    ? clubData.syndicateDAO?.activeModules ?? []
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const clearSearchValue = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    setSearchValue('');
  };

  return (
    <>
      {isRemixEnabled && (
        <>
          <div
            className={`flex flex-col md:flex-row w-full ${
              isAdmin ? '' : 'hidden'
            }`}
          >
            {/* top or left column */}
            <div className="flex-1 shrink-0">
              <div className="max-w-480">
                <Image
                  src={'/images/remix/remix-gradient.svg'}
                  height={32}
                  width={150}
                />
                <B1 extraClasses="mb-10 text-gray-syn3 mt-4">
                  Remix modules are modules in the smart contract that extend
                  your Collective with new functions.
                </B1>
                <CustomModuleCallout />
              </div>
            </div>
            {/* bottom or right column */}
            <div className="flex-1 shrink-0">
              <H4 weightClassOverride="normal">Modules</H4>
              <div className="flex justify-between flex-wrap items-center pt-2">
                <SearchInput
                  searchValue={searchValue}
                  onChangeHandler={handleSearchChange}
                  padding="py-2"
                  textCustom="sm:text-base"
                  searchItem=""
                  clearSearchValue={clearSearchValue}
                />

                <RemixLink
                  link="https://guide.syndicate.io/en/developer-platform/modules#custom-modules"
                  text="Create custom module"
                />
              </div>
              <RemixModules
                isAdmin={isAdmin}
                name={name}
                loading={loading || clubLoading}
                chainId={
                  getNetworkByName(query?.chain)?.chainId ||
                  activeNetwork?.chainId
                }
                activeModules={activeModules}
                searchValue={searchValue}
                decodedContractAddress={
                  (query?.contractAddress as string) ?? ''
                }
                decodedFnName={(query?.fn as string) ?? ''}
                encodedFnParams={query?.fnParams}
                entityType={entityType}
                entityAddress={contractAddress}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
