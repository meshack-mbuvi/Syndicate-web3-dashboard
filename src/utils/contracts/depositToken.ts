import { ISyndicateContracts } from '@/state/contracts';
import { isZeroAddress } from '..';

export const getDepositToken = async (
  contractAddress: string,
  syndicateContracts: ISyndicateContracts
): Promise<string> => {
  let depositToken =
    await syndicateContracts?.DepositTokenMintModule?.depositToken(
      contractAddress
    );

  if (isZeroAddress(depositToken)) {
    depositToken =
      await syndicateContracts?.SingleTokenMintModule?.depositToken(
        contractAddress
      );
  }

  return depositToken;
};
