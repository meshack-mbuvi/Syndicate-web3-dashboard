import {
  ICurrentSelectedToken,
  LogicalOperator,
  TokenGateRule
} from '@/state/createInvestmentClub/types';
import { RULES_LESS_THAN } from '@/utils/mixins/mixinHelpers';
import React from 'react';
import { PillButtonOutlined } from '../pillButtons/pillButtonOutlined';
import { TokenLogicList as TokenLogicList } from './tokenLogic';

interface Props {
  tokenRules: TokenGateRule[];
  handleRulesChange: (rules) => void;
  logicalOperator?: LogicalOperator;
  handleLogicalOperatorChange: (operator: LogicalOperator) => void;
  handleShowTokenSelector: (
    currentSelectedToken: ICurrentSelectedToken
  ) => void;
  isInErrorState?: boolean;
  customClasses?: string;
  ruleErrors?: number[];
  maxNumberRules?: number;
}

export const TokenLogicBuilder: React.FC<Props> = ({
  tokenRules,
  handleRulesChange,
  logicalOperator,
  handleLogicalOperatorChange,
  handleShowTokenSelector,
  isInErrorState = false,
  customClasses,
  ruleErrors,
  maxNumberRules = RULES_LESS_THAN
}) => {
  return (
    <div
      className={`${customClasses} space-y-4`} /* TODO style={{ minWidth: '30rem' }} */
    >
      <div className="text-gray-syn4 text-sm">
        To deposit into this club, members must hold
      </div>

      {/* Display token gating logic */}
      <TokenLogicList
        tokenRules={tokenRules}
        handleTokenSelection={(currentSelectedToken) =>
          handleShowTokenSelector(currentSelectedToken)
        }
        logicalOperator={logicalOperator}
        handleLogicalOperatorChange={handleLogicalOperatorChange}
        handleRulesChange={(rules) => {
          handleRulesChange(rules);
        }}
        isInErrorState={isInErrorState}
        helperText={isInErrorState ? 'Select a token or delete rule' : ''}
        ruleErrors={ruleErrors}
      />

      {/* Button to add a rule */}
      {tokenRules?.length < maxNumberRules && !isInErrorState && (
        <PillButtonOutlined
          onClick={() => {
            handleRulesChange([
              ...tokenRules,
              {
                name: null,
                symbol: null,
                quantity: 1,
                icon: null,
                chainId: null,
                contractAddress: null
              }
            ]);
          }}
        >
          <img src="/images/add-gray.svg" alt="Icon" className="w-4 h-4" />
          <div>Add a rule</div>
        </PillButtonOutlined>
      )}
    </div>
  );
};
