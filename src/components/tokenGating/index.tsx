import {
  ICurrentSelectedToken,
  TokenGateRule
} from '@/state/createInvestmentClub/types';
import { PillButtonOutlined } from '../pillButtons/pillButtonOutlined';
import {
  LogicalOperator,
  TokenLogicList as TokenLogicList
} from './tokenLogic';

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
}

export const TokenLogicBuilder: React.FC<Props> = ({
  tokenRules,
  handleRulesChange,
  logicalOperator,
  handleLogicalOperatorChange,
  handleShowTokenSelector,
  isInErrorState = false,
  customClasses,
  ruleErrors
}) => {
  return (
    <div className={`${customClasses} space-y-4`} style={{ minWidth: '30rem' }}>
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
        helperText={ruleErrors.length ? 'Select a token or delete rule' : ''}
        ruleErrors={ruleErrors}
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
