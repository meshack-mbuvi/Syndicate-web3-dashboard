import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import MintModuleHarness from '@/components/mintModules/MintModuleHarness';

type MintEligible = {
  isEligible: boolean;
  reason?: string;
};

const useMintModuleEligibility = (
  mintModule: MintModuleHarness
): MintEligible => {
  const {
    web3Reducer: {
      web3: { account }
    }
  } = useSelector((state: AppState) => state);

  const [isEligible, setIsEligable] = useState<MintEligible>({
    isEligible: false
  });

  useEffect(() => {
    void mintModule.isEligible(account).then(setIsEligable);
  }, [mintModule, account]);

  return isEligible;
};

export default useMintModuleEligibility;
