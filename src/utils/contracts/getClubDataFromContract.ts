import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { GuardMixinManager } from '@/ClubERC20Factory/GuardMixinManager';
import { MaxTotalSupplyMixin } from '@/ClubERC20Factory/maxTotalSupplyMixin';
import { TimeRequirements } from '@/ClubERC20Factory/TimeRequirements';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { ISyndicateContracts } from '@/state/contracts';
import { ModuleReqs } from '@/types/modules';
import { getSyndicateValues } from '@/utils/contracts/getSyndicateValues';
import { getTokenDetails } from '../api';
import { divideIfNotByZero, getWeiAmount } from '../conversions';
import { isZeroAddress } from '../isZeroAddress';
import { getDepositToken } from './depositToken';
import { getModuleRequirementValues } from './getRequirementValues';

type clubFromContract = {
  tokenAddress;
  name;
  symbol;
  state: {
    activeNetwork;
    account: string;
    syndicateContracts: ISyndicateContracts;
    web3;
    activeMintModuleReqs: ModuleReqs;
    mintModule: string;
  };
};

export const getClubDataFromContract = async ({
  tokenAddress,
  name,
  symbol,
  state: {
    activeNetwork,
    account,
    syndicateContracts,
    web3,
    activeMintModuleReqs,
    mintModule
  }
}: clubFromContract): Promise<any> => {
  const clubERC20 = new ClubERC20Contract(tokenAddress, web3, activeNetwork);

  const [owner, decimals, totalSupply, membersCount, memberTokens] =
    await Promise.all([
      await clubERC20.owner(),
      await clubERC20.decimals(),
      await clubERC20.totalSupply(),
      await clubERC20.memberCount(),
      await clubERC20.balanceOf(account)
    ]);

  let { endTime, maxTotalSupply, startTime, currentMintPolicyAddress } =
    await getSyndicateValues(
      tokenAddress,
      syndicateContracts?.policyMintERC20,
      syndicateContracts?.mintPolicy,
      syndicateContracts?.guardMixinManager,
      activeMintModuleReqs,
      mintModule
    );

  // guardMixinCheck
  if (!endTime || !maxTotalSupply || !startTime || !currentMintPolicyAddress) {
    const guardMixinManager = new GuardMixinManager(
      CONTRACT_ADDRESSES[activeNetwork.chainId].GuardMixinManager,
      web3,
      activeNetwork
    );
    const timeWindowMixin = new TimeRequirements(
      CONTRACT_ADDRESSES[activeNetwork.chainId].TimeRequirements,
      web3,
      activeNetwork
    );
    const maxTotalSupplyMixin = new MaxTotalSupplyMixin(
      CONTRACT_ADDRESSES[activeNetwork.chainId].maxTotalSupplyMixin,
      web3,
      activeNetwork
    );
    currentMintPolicyAddress = guardMixinManager.address;
    ({ endTime, startTime, maxTotalSupply } = await getModuleRequirementValues(
      tokenAddress,
      guardMixinManager,
      syndicateContracts.NativeMintModule.address,
      timeWindowMixin,
      maxTotalSupplyMixin
    ));

    if (!endTime || !maxTotalSupply || !startTime) {
      ({ endTime, startTime, maxTotalSupply } =
        await getModuleRequirementValues(
          tokenAddress,
          guardMixinManager,
          syndicateContracts.DepositTokenMintModule.address,
          timeWindowMixin,
          maxTotalSupplyMixin
        ));
    }
  }

  const status = 'Open to deposits';

  const ownershipShare = divideIfNotByZero(+memberTokens * 100, totalSupply);

  const depositToken = await getDepositToken(tokenAddress, syndicateContracts);

  let depositERC20TokenSymbol = activeNetwork.nativeCurrency.symbol;
  let depositTokenLogo = activeNetwork.logo;

  if (!isZeroAddress(depositToken) && depositToken) {
    try {
      const depositERC20Token = new ClubERC20Contract(
        depositToken,
        web3,
        activeNetwork
      );
      depositERC20TokenSymbol = await depositERC20Token.symbol();
      depositTokenLogo = await getTokenDetails(
        depositToken,
        activeNetwork.chainId
      )
        .then((res) => res.data.logo)
        .catch(() => null);
    } catch (error) {
      return;
    }
  }

  return {
    ownershipShare,
    address: tokenAddress,
    clubName: name,
    clubSymbol: symbol,
    status,
    tokenDecimals: 18,
    depositAmount: '0',
    distributions: '0',
    depositsEnabled: true,
    depositERC20TokenSymbol,
    depositTokenLogo,
    maxMemberCount: +membersCount,
    requiredToken: '',
    requiredTokenMinBalance: 0,
    contractAddress: tokenAddress.toLowerCase(),
    ownerAddress: account,
    myWithdrawals: '0',
    totalDeposits: '0',
    membersCount: 0,
    memberDeposits: 0,
    isOwner: true,
    currentMintPolicyAddress,
    totalSupply,
    name,
    owner,
    symbol,
    memberCount: membersCount,
    loading: false,
    maxTotalSupply: getWeiAmount(web3, maxTotalSupply, +decimals, false),
    maxTotalDeposits: getWeiAmount(web3, maxTotalSupply, +decimals, false), //should be updated if token prices is not 1:1
    startTime: parseInt(startTime, 10) * 1000, // time is in seconds. need to change to milliseconds
    endTime: parseInt(endTime, 10) * 1000 // time is in seconds. need to change to milliseconds
  };
};
