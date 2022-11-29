import { DealsCreateParticipation } from '@/features/deals/components/create/participation';
import { useState } from 'react';

export default {
  title: '5. Organisms/Deals/Create/Participation'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  const [tokenSymbol, setTokenSymbol] = useState('USDC');
  return (
    <DealsCreateParticipation
      tokenSymbol={tokenSymbol}
      handleTokenSymbolChange={setTokenSymbol}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {};
