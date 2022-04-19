import React from 'react';
import { PillButtonOutlined } from '../pillButtons/pillButtonOutlined';
import {
  LogicalOperator,
  TokenLogicList as TokenLogicList
} from './tokenLogic';

interface Props {
  tokenRules: {
    name: string;
    symbol?: string;
    quantity: number;
    icon: string;
  }[];
  handleRulesChange: (rules) => void;
  logicalOperator?: LogicalOperator.OR;
  handleLogicalOperatorChange: (operator: LogicalOperator) => void;
  handleShowTokenSelector: () => void;
  isInErrorState?: boolean;
  customClasses?: string;
}

export const TokenLogicBuilder: React.FC<Props> = ({
  tokenRules,
  handleRulesChange,
  logicalOperator,
  handleLogicalOperatorChange,
  handleShowTokenSelector,
  isInErrorState = false,
  customClasses
}) => {
  return (
    <div className={`${customClasses} space-y-4`} style={{ minWidth: '30rem' }}>
      <div className="text-gray-syn4">
        To deposit into this club, members must hold
      </div>

      {/* Display token gating logic */}
      <TokenLogicList
        tokenRules={tokenRules}
        handleTokenSelection={handleShowTokenSelector} // TODO:
        logicalOperator={logicalOperator}
        handleLogicalOperatorChange={handleLogicalOperatorChange}
        handleRulesChange={(rules) => {
          handleRulesChange(rules);
        }}
        isInErrorState={isInErrorState}
        helperText={isInErrorState && 'Select a token or delete rule'}
      />

      {/* Button to add a rule */}
      <PillButtonOutlined
        onClick={() => {
          handleRulesChange([
            ...tokenRules,
            { name: null, symbol: null, quantity: 1, icon: null }
          ]);
        }}
      >
        <img src="/images/add-gray.svg" alt="Icon" className="w-4 h-4" />
        <div>Add a rule</div>
      </PillButtonOutlined>
    </div>
  );
};
