import { TokenLogicBuilder } from '@/components/tokenGating';
import {
  LogicalOperator,
  TokenGateRule
} from '@/state/createInvestmentClub/types';
import { useState } from 'react';

export default {
  title: '4. Organisms/Token Gated Logic'
};

const Template = (args) => {
  const [tokenRules, setTokenRules] = useState<TokenGateRule[]>([
    {
      name: 'Token Name',
      symbol: 'TOKN',
      quantity: 1,
      icon: null,
      chainId: 4,
      contractAddress: ''
    },
    {
      name: 'Token Name',
      symbol: 'TOKN',
      quantity: 30,
      icon: null,
      chainId: 4,
      contractAddress: ''
    },
    {
      name: 'Token Name',
      symbol: 'TOKN',
      quantity: 100,
      icon: null,
      chainId: 4,
      contractAddress: ''
    }
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
