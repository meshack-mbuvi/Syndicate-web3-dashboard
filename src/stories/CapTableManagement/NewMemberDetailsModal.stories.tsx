import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import MemberDetailsModal from '@/containers/managerActions/mintAndShareTokens/MemberDetailsModal';
import { numberInputRemoveCommas } from '@/utils/formattedNumbers';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title:
    'Organisms/Cap Table Management/Modals/Add Member/Add Member Details Modal',
  parameters: {
    nextRouter: {
      query: {
        clubAddress: '0xA596dd3bC192990174fF2eC7f844f4225e20f61b'
      }
    }
  },
  decorators: [
    (Story: any) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Story />
        </Provider>
      </ApolloProvider>
    )
  ]
};

const Template = (args: any) => {
  const [amountToMint, setAmountToMint] = useState('0');
  const [memberAddress, setMemberAddress] = useState('');
  const handleAddressChange = (e: any) => {
    const addressValue = e.target.value;
    setMemberAddress(addressValue);
  };

  const handleAmountChange = (e: any) => {
    const amount = numberInputRemoveCommas(e);
    // @ts-expect-error TS(2365): Operator '>=' cannot be applied to types 'string' ... Remove this comment to see the full error message
    setAmountToMint(amount >= 0 ? amount : '');
  };
  return (
    <MemberDetailsModal
      {...args}
      {...{
        amountToMint,
        handleAmountChange,
        memberAddress,
        handleAddressChange
      }}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  show: true,
  symbol: '✺RACA'
};
