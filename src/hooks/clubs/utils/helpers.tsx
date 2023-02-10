import {
  CustomSyndicateDao,
  DynamicSyndicateDaoProperties
} from '@/hooks/clubs/utils/types';
import { SyndicateDao } from '@/hooks/data-fetching/thegraph/generated-types';
import { IActiveNetwork } from '@/state/wallet/types';
import { pastDate } from '@/utils';
import { getDepositToken } from '@/utils/contracts/depositToken';
import { getTokenDetails } from '@/utils/contracts/token';
import { divideIfNotByZero, getWeiAmount } from '@/utils/conversions';
import { ApolloClient } from '@apollo/client';

export const processClubERC20Tokens = async (
  account: string,
  tokens: Partial<CustomSyndicateDao>[] | undefined,
  activeNetwork: IActiveNetwork,
  syndicateContracts: any,
  apolloClient: ApolloClient<any>
): Promise<Partial<CustomSyndicateDao>[]> => {
  if (!tokens || !tokens?.length) {
    return [];
  }

  const processedTokens:
    | (Partial<SyndicateDao & DynamicSyndicateDaoProperties> | undefined)[] =
    (
      await Promise.all<
        Promise<
          Partial<SyndicateDao & DynamicSyndicateDaoProperties> | undefined
        >[]
      >(
        tokens.map(
          async ({
            contractAddress,
            members,
            ownerAddress,
            totalDeposits,
            totalSupply,
            endTime,
            depositAmount,
            maxTotalSupply
          }): Promise<
            Partial<SyndicateDao & DynamicSyndicateDaoProperties> | undefined
          > => {
            if (!contractAddress) return;

            const { name, symbol, decimals } = await getTokenDetails(
              contractAddress,
              activeNetwork.chainId,
              apolloClient
            );

            const maxTotalSupplyFromWei = getWeiAmount(
              maxTotalSupply,
              +decimals,
              false
            ) as string;

            const totalSupplyFromWei = getWeiAmount(
              totalSupply,
              decimals,
              false
            ) as string;

            const depositToken =
              (await getDepositToken(contractAddress, syndicateContracts)) ||
              '';

            const {
              symbol: depositERC20TokenSymbol,
              decimals: depositERC20TokenDecimals,
              logo: depositTokenLogo
            } = await getTokenDetails(
              depositToken,
              activeNetwork.chainId,
              apolloClient
            );

            const maxTotalDeposits =
              +maxTotalSupplyFromWei /
              activeNetwork.nativeCurrency.exchangeRate;

            let memberDeposits = 0;

            if (depositAmount !== undefined) {
              memberDeposits = +getWeiAmount(
                depositAmount,
                depositERC20TokenDecimals ? depositERC20TokenDecimals : 18,
                false
              );
            }

            let clubTotalDeposits = 0;
            if (depositERC20TokenDecimals) {
              clubTotalDeposits = +getWeiAmount(
                totalDeposits,
                +depositERC20TokenDecimals,
                false
              );
            }

            // calculate ownership share
            // we need to filter to get club tokens amount for this specific member
            // this is not ideal.
            // we should be able to get this value straight from the graph, similar to depositAmount.
            const [member] =
              members?.filter(
                (currentMember: any) =>
                  currentMember?.member?.memberAddress.toLowerCase() ===
                  account.toLowerCase()
              ) || [];
            const memberTokens = member?.tokens || 0;

            let status = 'Open to deposits';
            if (pastDate(new Date(+endTime * 1000))) {
              status = 'Active';
            } else if (
              +totalSupplyFromWei === +maxTotalSupplyFromWei ||
              +clubTotalDeposits === +maxTotalDeposits
            ) {
              status = 'Fully deposited';
            }

            const ownershipShare = divideIfNotByZero(
              +memberTokens * 100,
              totalSupply
            );

            return {
              name,
              symbol,
              ownershipShare,
              depositERC20TokenSymbol,
              depositTokenLogo,
              contractAddress,
              memberDeposits,
              status,
              totalDeposits: clubTotalDeposits,
              membersCount: members?.length || 0,
              isOwner:
                ownerAddress?.toLocaleLowerCase() == account.toLocaleLowerCase()
            };
          }
        )
      )
    ).filter((token) => token !== undefined) || [];

  return processedTokens as Partial<CustomSyndicateDao>[];
};
