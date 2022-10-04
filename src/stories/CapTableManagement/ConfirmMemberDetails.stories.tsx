import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import ConfirmMemberDetailsModal from '@/containers/managerActions/mintAndShareTokens/ConfirmMemberDetailsModal';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title:
    '4. Organisms/Cap Table Management/Modals/Add Member/Confirm Member Details Modal',
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
  return <ConfirmMemberDetailsModal {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  preview: true,
  symbol: '✺RACA',
  memberAddress: '0x115403d97d5cbaeaE947407ADE593CC0797896EE',
  amountToMint: '300',
  ownershipShare: 23,
  totalSupply: '3000',
  totalSupplyPostMint: 3300
};
