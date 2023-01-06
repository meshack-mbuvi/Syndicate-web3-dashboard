import { SkeletonLoader } from '@/components/skeletonLoader';
import { ContractUI } from './shared/ContractUI';
import { Module } from '@/types/modules';
import Modal, { ModalStyle } from '@/components/modal';

interface RemixModulesProps {
  isAdmin: boolean;
  name: string;
  loading: boolean;
  chainId: number;
  activeModules: Module[];
  searchValue: string;
  entityType: 'club' | 'collective';
  entityAddress: string;
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
  entityType,
  entityAddress,
  decodedFnName,
  decodedContractAddress,
  encodedFnParams
}: RemixModulesProps) => {
  const all: Module[] = activeModules;
  //TODO [REMIX]: [PRO2-76] v0.1+ add supported modules to browse
  const combinedList = all.filter(
    (v, i, a) =>
      a.findIndex((v2) => v2.contractAddress === v.contractAddress) === i
  );

  return (
    <>
      {loading ? (
        <>
          {decodedFnName ? (
            <Modal
              show={loading}
              modalStyle={ModalStyle.DARK}
              customWidth={'w-full max-w-480'}
              customClassName={'py-8 px-6'}
            >
              <>
                <SkeletonLoader
                  width="60"
                  height="6"
                  borderRadius="rounded-md"
                />
                <div className="mt-2">
                  <SkeletonLoader
                    width={'100'}
                    height={'10'}
                    borderRadius="rounded-md"
                  />
                </div>
                <div className="mt-3">
                  <SkeletonLoader
                    width={'160'}
                    height={'6'}
                    borderRadius="rounded-sm"
                  />
                </div>
              </>
            </Modal>
          ) : (
            <SkeletonLoader
              width="355"
              height="32"
              borderRadius="rounded-full"
            />
          )}
        </>
      ) : (
        <div className="flex flex-wrap justify-between mt-4">
          {combinedList?.map((match: Module, i: number) => {
            return (
              <ContractUI
                contractAddress={match.contractAddress}
                name={name}
                entityType={entityType}
                entityAddress={entityAddress}
                isActiveModule={activeModules?.some(
                  (m) =>
                    m.contractAddress?.toLowerCase() ===
                    match.contractAddress?.toLowerCase()
                )}
                chainId={chainId}
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
