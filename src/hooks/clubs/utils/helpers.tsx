import { pastDate } from '@/utils';
import { getDepositToken } from '@/utils/contracts/depositToken';
import { divideIfNotByZero, getWeiAmount } from '@/utils/conversions';
import { getTokenDetails } from '@/utils/contracts/token';
import { IClubERC20, IGraphClubsResponse } from '@/hooks/clubs/utils/types';
import { ApolloClient } from '@apollo/client';
import { IActiveNetwork } from '@/state/wallet/types';

export const processClubERC20Tokens = async (
  account: string,
  tokens: IGraphClubsResponse[],
  activeNetwork: IActiveNetwork,
  web3: any,
  syndicateContracts: any,
  apolloClient: ApolloClient<any>
): Promise<IClubERC20[]> => {
  if (!tokens || !tokens?.length) {
    return [];
  }

  const processedTokens: IClubERC20[] = (
    await Promise.all<Promise<IClubERC20>[]>(
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
        }: IGraphClubsResponse): Promise<IClubERC20> => {
          const {
            name: clubName,
            symbol: clubSymbol,
            decimals
          } = await getTokenDetails(
            contractAddress,
            activeNetwork.chainId,
            apolloClient
          );

          const maxTotalSupplyFromWei = getWeiAmount(
            web3,
            maxTotalSupply,
            +decimals,
            false
          ) as string;

          const totalSupplyFromWei = getWeiAmount(
            web3,
            totalSupply,
            decimals,
            false
          ) as string;

          const depositToken =
            (await getDepositToken(contractAddress, syndicateContracts)) || '';

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
            +maxTotalSupplyFromWei / activeNetwork.nativeCurrency.exchangeRate;

          const memberDeposits = getWeiAmount(
            web3,
            depositAmount,
            depositERC20TokenDecimals ? depositERC20TokenDecimals : 18,
            false
          );

          let clubTotalDeposits = 0;
          if (depositERC20TokenDecimals) {
            clubTotalDeposits = getWeiAmount(
              web3,
              totalDeposits,
              +depositERC20TokenDecimals,
              false
            );
          }

          // calculate ownership share
          // we need to filter to get club tokens amount for this specific member
          // this is not ideal.
          // we should be able to get this value straight from the graph, similar to depositAmount.
          const [member] = members?.filter(
            (currentMember: any) =>
              currentMember?.member?.memberAddress.toLowerCase() ===
              account.toLowerCase()
          );
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

          return {
            clubName,
            clubSymbol,
            ownershipShare: divideIfNotByZero(+memberTokens * 100, totalSupply),
            depositERC20TokenSymbol,
            depositTokenLogo,
            address: contractAddress,
            totalDeposits: clubTotalDeposits,
            membersCount: members.length,
            memberDeposits,
            status,
            isOwner:
              ownerAddress.toLocaleLowerCase() == account.toLocaleLowerCase()
          };
        }
      )
    )
  ).filter((club) => club);

  return processedTokens;
};
