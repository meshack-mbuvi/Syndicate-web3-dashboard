export type MintModuleEligibility = {
  isEligible: boolean;
  reason?: string;
};

interface MintModuleHarness {
  mintPrice: string;
  isEligible: (address: string) => Promise<MintModuleEligibility>;
  mint: (
    tokenAddress: string,
    account: string,
    onTxConfirm: (hash: string) => void,
    onTxReceipt: () => void,
    onTxFail: (error: Error) => void
  ) => Promise<void>;
}

export default MintModuleHarness;
