import { useEffect, useState } from 'react';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { ContractUI } from './shared/ContractUI';
import { Module } from '@/types/modules';

interface RemixModulesProps {
  isAdmin: boolean;
  name: string;
  loading: boolean;
  chainId: number;
  activeModules: Module[];
  searchValue: string;
  decodedFnName?: string;
  decodedContractAddress?: string;
  encodedFnParams?: string | string[] | undefined;
}

const RemixModules: React.FC<RemixModulesProps> = ({
  isAdmin,
  name,
  loading,
  chainId,
  activeModules,
  searchValue,
  decodedFnName,
  decodedContractAddress,
  encodedFnParams
}: RemixModulesProps) => {
  const [combinedList, setCombinedList] = useState<Module[]>();

  useEffect(() => {
    //TODO [REMIX]: v0.1+ add supported modules to browse
    const all = [...(activeModules || []), ...[]];

    const filtered = all.filter(
      (v, i, a) =>
        a.findIndex((v2) => v2.contractAddress === v.contractAddress) === i
    );
    setCombinedList(filtered);
  }, [activeModules, chainId]);

  return (
    <>
      {loading ? (
        <>
          <SkeletonLoader width="355" height="32" borderRadius="rounded-full" />
        </>
      ) : (
        <div className="flex flex-col xl:flex-row min-w-0 flex-wrap justify-between">
          {combinedList?.map((match: Module, i: number) => {
            return (
              <ContractUI
                contractAddress={match.contractAddress}
                name={name}
                isActiveModule={activeModules?.some(
                  (m) =>
                    m.contractAddress?.toLowerCase() ===
                    match.contractAddress?.toLowerCase()
                )}
                chainId={chainId}
                index={i}
                key={`${i}-${match?.contractAddress}`}
                isAdmin={isAdmin}
                decodedFnName={
                  match.contractAddress?.toLowerCase() ===
                  decodedContractAddress?.toLowerCase()
                    ? decodedFnName
                    : ''
                }
                encodedFnParams={
                  match.contractAddress?.toLowerCase() ===
                  decodedContractAddress?.toLowerCase()
                    ? encodedFnParams
                    : ''
                }
                searchValue={searchValue}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default RemixModules;
