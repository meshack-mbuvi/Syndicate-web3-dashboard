import { TokenLogicBuilder } from '@/components/tokenGating';
import {
  LogicalOperator,
  TokenGateRule
} from '@/state/createInvestmentClub/types';
import { useState } from 'react';

export default {
  title: '4. Organisms/Token Gated Logic'
};

const Template = (args: any) => {
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  isInErrorState: false
};
