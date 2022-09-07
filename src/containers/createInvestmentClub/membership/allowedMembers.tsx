import React, { useEffect, useState } from 'react';
import { DetailedTile } from '@/components/tile/detailedTile';
import { TokenLogicBuilder } from '@/components/tokenGating';
import { AppState } from '@/state';
import { useDispatch, useSelector } from 'react-redux';
import {
  ICurrentSelectedToken,
  LogicalOperator,
  TokenGateOption,
  TokenGateRule
} from '@/state/createInvestmentClub/types';
import {
  setActiveTokenGateOption,
  setDuplicateRulesError,
  setCurrentSelectedToken,
  setNullRulesError,
  setMoreThanFiveRules,
  setShowTokenGateModal,
  setTokenRules,
  setLogicalOperator
} from '@/state/createInvestmentClub/slice';
import TokenSelectModal, {
  TokenModalVariant
} from '@/components/tokenSelect/TokenSelectModal';
import { validateDuplicateRules, validateNullRules } from '@/utils/validators';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { RULES_LESS_THAN } from '@/utils/mixins/mixinHelpers';

const CREATE_COLLECTIVE_TEXT = ' To create membership passes for the club, ';
import { B2, B3, B4 } from '@/components/typography';

const AllowedMembers: React.FC = () => {
  const {
    createInvestmentClubSliceReducer: {
      investmentClubSymbol,
      tokenGateOption: active,
      tokenRules,
      showTokenGateModal,
      errors: { duplicateRules, nullRules, hasMoreThanFiveRules },
      logicalOperator
    },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const { setNextBtnDisabled } = useCreateInvestmentClubContext();

  const dispatch = useDispatch();
  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    if (
      duplicateRules?.length < 1 &&
      nullRules?.length < 1 &&
      !hasMoreThanFiveRules
    ) {
      setNextBtnDisabled(false);
      setHasErrors(false);
    } else {
      setHasErrors(true);
      setNextBtnDisabled(true);
    }
  }, [duplicateRules, nullRules, hasMoreThanFiveRules]);

  const setTokenGateRules = (rules: TokenGateRule[]) => {
    dispatch(setTokenRules(rules));

    // Handle duplicate validation
    const _duplicateRules = validateDuplicateRules(rules, logicalOperator);
    dispatch(setDuplicateRulesError(_duplicateRules));

    // Handle null rules validation
    const _nullRules = validateNullRules(rules);
    dispatch(setNullRulesError(_nullRules));

    // Handle more than 5 rules validation
    const _moreThanFive = rules.length > 5;
    dispatch(
      _moreThanFive ? setMoreThanFiveRules(true) : setMoreThanFiveRules(false)
    );
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
        {CREATE_COLLECTIVE_TEXT}
        <a
          href="/collectives/create"
          target="_blank"
          className="text-orange-utopia"
        >
          launch a Collective →
        </a>
      </div>

      {/* Select who is allowed to deposit? */}
      {/* TODO: replace with fixed DetailedTile component */}
      <div className="flex text-center border border-gray-syn6 rounded-md min-h-32 min-h-29">
        <button
          className={`w-1/2 p-4 rounded-md transition-all ${
            active === TokenGateOption.RESTRICTED
              ? 'ring-blue ring-1'
              : 'ring-transparent ring-0'
          }`}
          onClick={() => {
            setActive(TokenGateOption.RESTRICTED);
          }}
        >
          <div className="h-full space-y-3">
            <div className="flex-grow h-8">
              <img
                src="/images/collectibles-gray.svg"
                alt="Holders of NFTs/tokens"
                className="h-full mx-auto"
              />
            </div>
            <div>
              <B3 extraClasses="mb-0.5">Holders of certain NFTs/tokens</B3>
              <B4 extraClasses="text-gray-syn4">
                Holders of certain NFTs/tokens
              </B4>
            </div>
          </div>
        </button>
        <button
          className={`w-1/2 p-4 rounded-md transition-all ${
            active === TokenGateOption.UNRESTRICTED
              ? 'ring-blue ring-1'
              : 'ring-transparent ring-0'
          }`}
          onClick={() => {
            setActive(TokenGateOption.UNRESTRICTED);
          }}
        >
          <div className="h-full space-y-3">
            <div className="flex-grow h-8">
              <img
                src="/images/link-chain-gray.svg"
                alt="Anyone"
                className="h-full mx-auto"
              />
            </div>
            <div>
              <B3 extraClasses="mb-0.5">Anyone with the link</B3>
              <B4 extraClasses="text-gray-syn4">Anyone with the link</B4>
            </div>
          </div>
        </button>
      </div>

      {active === TokenGateOption.RESTRICTED && (
        <div className="pt-8 pb-2">
          <TokenLogicBuilder
            handleLogicalOperatorChange={handleLogicalOperatorChange}
            handleRulesChange={setTokenGateRules}
            logicalOperator={logicalOperator}
            tokenRules={tokenRules}
            ruleErrors={Array.from(new Set([...duplicateRules, ...nullRules]))}
            isInErrorState={hasErrors}
            handleShowTokenSelector={(placeholder) =>
              showTokenSelectModal(true, placeholder)
            }
            maxNumberRules={RULES_LESS_THAN}
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
