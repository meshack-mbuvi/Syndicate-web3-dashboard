import { ClubMixinParams } from '@/ClubERC20Factory/ERC20ClubFactory';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';
import { getWeiAmount } from '@/utils/conversions';
const useSubmitReqsToFactory = (
  onTxConfirm: (transactionHash: any) => void,
  onTxReceipt: (receipt: any) => void,
  onTxFail: (err: any) => void
): { submitCreateClub: () => Promise<void> } => {
  const {
    web3Reducer: {
      web3: { web3, account, activeNetwork }
    },
    initializeContractsReducer: {
      syndicateContracts: { erc20ClubFactory }
    },
    createInvestmentClubSliceReducer: {
      investmentClubName,
      investmentClubSymbol,
      mintEndTime: { value: endMintTime },
      membersCount,
      tokenDetails: { depositToken, depositTokenSymbol },
      tokenCap,
      tokenRules,
      tokenGateOption,
      logicalOperator
    }
  } = useSelector((state: AppState) => state);

  const isNativeDeposit =
    depositTokenSymbol == activeNetwork.nativeCurrency.symbol;

  const clubParams: ClubMixinParams = {
    clubTokenName: investmentClubName,
    clubTokenSymbol: investmentClubSymbol,
    isNativeDeposit,
    depositToken,
    // tokencap has 18 decimals on protocol
    tokenCap: isNativeDeposit
      ? getWeiAmount(
          web3,
          (
            +tokenCap * (activeNetwork?.nativeCurrency?.exchangeRate ?? 1)
          ).toString(),
          18,
          true
        )
      : getWeiAmount(web3, tokenCap, 18, true),
    startTime: (~~(new Date().getTime() / 1000)).toString(),
    endTime: endMintTime.toString(),
    membersCount: +membersCount,
    tokenRules,
    tokenGateOption,
    logicalOperator
  };

  const submitCreateClub = async () => {
    await erc20ClubFactory.create(
      account,
      clubParams,
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  };

  return {
    submitCreateClub
  };
};

export default useSubmitReqsToFactory;
