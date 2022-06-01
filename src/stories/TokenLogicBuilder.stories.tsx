import { TokenLogicBuilder } from '@/components/tokenGating';
import { LogicalOperator } from '@/components/tokenGating/tokenLogic';
import { useState } from 'react';

export default {
  title: '4. Organisms/Token Gated Logic'
};

const Template = (args) => {
  const [tokenRules, setTokenRules] = useState([
    { name: 'Token Name', symbol: 'TOKN', quantity: 1, icon: null },
    { name: 'Token Name', symbol: 'TOKN', quantity: 30, icon: null },
    { name: 'Token Name', symbol: 'TOKN', quantity: 100, icon: null }
  ]);
  const [logicalOperator, setLogicalOperator] = useState(LogicalOperator.OR);

  return (
    <TokenLogicBuilder
      tokenRules={tokenRules}
      handleRulesChange={setTokenRules}
      logicalOperator={logicalOperator}
      handleLogicalOperatorChange={setLogicalOperator}
      handleShowTokenSelector={() => {
        alert('This would show the token selector');
      }}
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  isInErrorState: false
};
