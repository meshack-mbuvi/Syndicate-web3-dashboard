import React, { useState } from 'react';
import { DetailedTile } from '@/components/tile/detailedTile';
import { LogicalOperator } from '@/components/tokenGating/tokenLogic';
import { TokenLogicBuilder } from '@/components/tokenGating';
import { AppState } from '@/state';
import { useDispatch, useSelector } from 'react-redux';
import {
  ICurrentSelectedToken,
  TokenGateOption,
  TokenGateRule
} from '@/state/createInvestmentClub/types';
import {
  setActiveTokenGateOption,
  setDuplicateRulesError,
  setCurrentSelectedToken,
  setNullRulesError,
  setShowTokenGateModal,
  setTokenRules,
  setLogicalOperator
} from '@/state/createInvestmentClub/slice';
import TokenSelectModal, {
  TokenModalVariant
} from '@/components/tokenSelect/TokenSelectModal';
import { validateDuplicateRules, validateNullRules } from '@/utils/validators';

const AllowedMembers: React.FC = () => {
  const {
    createInvestmentClubSliceReducer: {
      investmentClubSymbol,
      tokenGateOption: active,
      tokenRules,
      showTokenGateModal,
      errors: { duplicateRules, nullRules },
      logicalOperator
    },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const setTokenGateRules = (rules: TokenGateRule[]) => {
    dispatch(setTokenRules(rules));

    // Handle duplicate validation
    const _duplicateRules = validateDuplicateRules(rules, logicalOperator);
    dispatch(setDuplicateRulesError(_duplicateRules));

    // Handle null rules validation
    const _nullRules = validateNullRules(rules);
    dispatch(setNullRulesError(_nullRules));
  };

  const setActive = (option: TokenGateOption) => {
    dispatch(setActiveTokenGateOption(option));
  };

  const showTokenSelectModal = (
    option: boolean,
    currentSelectedToken: ICurrentSelectedToken
  ) => {
    dispatch(setShowTokenGateModal(option));
    dispatch(setCurrentSelectedToken(currentSelectedToken));
  };

  const handleLogicalOperatorChange = (operator: LogicalOperator) => {
    dispatch(setLogicalOperator(operator));

    // Handle duplicate validation
    const _duplicateRules = validateDuplicateRules(tokenRules, operator);
    dispatch(setDuplicateRulesError(_duplicateRules));
  };

  return (
    <div>
      <div className="text-xl pb-0.5">
        Who is allowed to deposit and become a member?
      </div>
      <div className="text-sm text-gray-syn4 pb-4">
        Into investment clubs, in exchange for ✺{investmentClubSymbol} community
        tokens
      </div>
      <DetailedTile
        activeIndex={active}
        onClick={setActive}
        options={[
          {
            icon: '/images/collectibles-gray.svg',
            subTitle: 'Token-gated',
            title: 'Holders of certain NFTs/tokens'
          },
          {
            icon: '/images/link-chain-gray.svg',
            subTitle: 'Unrestricted',
            title: 'Anyone with the link'
          }
        ]}
      />

      {active === TokenGateOption.RESTRICTED && (
        <div className="pt-8 pb-2">
          <TokenLogicBuilder
            handleLogicalOperatorChange={handleLogicalOperatorChange}
            handleRulesChange={setTokenGateRules}
            logicalOperator={logicalOperator}
            tokenRules={tokenRules}
            ruleErrors={Array.from(new Set([...duplicateRules, ...nullRules]))}
            handleShowTokenSelector={(placeholder) =>
              showTokenSelectModal(true, placeholder)
            }
          />
        </div>
      )}

      <TokenSelectModal
        showModal={showTokenGateModal}
        closeModal={() => dispatch(setShowTokenGateModal(false))}
        variant={TokenModalVariant.RecentlyUsed}
        chainId={activeNetwork.chainId}
      />
    </div>
  );
};

export default AllowedMembers;
