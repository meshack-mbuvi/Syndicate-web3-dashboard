import { ActiveModule, ModuleType } from '@/types/modules';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { IActiveNetwork } from '@/state/wallet/types';

/**
 * Temporary placeholder for getting modules by type
 * Currently hardcoded which ones are by which type so would need to be
 * update each time an additional module is added
 * @param type
 * @param modules
 * @returns
 */
const getModuleByType = (
  type: ModuleType,
  modules: ActiveModule[],
  activeNetwork: IActiveNetwork
): ActiveModule | null => {
  if (modules.length < 1) {
    return null;
  }
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const activeNetworkAddresses = CONTRACT_ADDRESSES[activeNetwork.chainId];
  const ownerModules: string[] = [
    activeNetworkAddresses.OwnerMintModule.toLowerCase()
  ];
  const mintModules: string[] = [
    activeNetworkAddresses.NativeMintModule.toLowerCase(),
    activeNetworkAddresses.DepositTokenMintModule.toLowerCase(),
    activeNetworkAddresses.SingleTokenMintModule.toLowerCase()
  ];

  const moduleLookup = {
    [ModuleType.MINT]: mintModules,
    [ModuleType.OWNER]: ownerModules
  };

  for (let i = 0; i < modules.length; i++) {
    if (moduleLookup[type].includes(modules[i].contractAddress)) {
      return modules[i];
    }
  }
  return null;
};

export default getModuleByType;
