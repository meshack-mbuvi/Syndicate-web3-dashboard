import {
  LogicalOperator,
  TokenLogicList
} from '@/components/tokenGating/tokenLogic';
import { useState } from 'react';

export default {
  title: '3. Molecules/Token Logic List'
};

const Template = (args) => {
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
Default.args = {
  isInErrorState: false,
  helperText: 'Lorum ipsum dolor'
};
