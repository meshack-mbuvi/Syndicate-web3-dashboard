import { TokenLogicList } from '@/components/tokenGating/tokenLogic';
import { LogicalOperator } from '@/state/createInvestmentClub/types';
import { useState } from 'react';

export default {
  title: '3. Molecules/Token Logic List'
};

const Template = (args: any) => {
  const [tokenRules, setTokenRules] = useState([
    { name: 'Token Name', symbol: 'TOKN', quantity: 1, icon: null },
    { name: 'Token Name', symbol: 'TOKN', quantity: 30, icon: null },
    { name: 'Token Name', symbol: 'TOKN', quantity: 100, icon: null }
  ]);
  const [logicalOperator, setLogicalOperator] = useState(LogicalOperator.OR);

  return (
    <TokenLogicList
      tokenRules={tokenRules}
      handleRulesChange={setTokenRules}
      logicalOperator={logicalOperator}
      handleLogicalOperatorChange={setLogicalOperator}
      handleTokenSelection={() => {
        alert('This would show the token selector');
      }}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  isInErrorState: false,
  helperText: 'Lorum ipsum dolor',
  ruleErrors: []
};
