import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import ConfirmMemberAllocations from '@/containers/managerActions/modifyMemberAllocation/ConfirmMemberAllocations';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title:
    '4. Organisms/Cap Table Management/Modals/Modify Member Tokens/Confirm member allocation',
  parameters: {
    nextRouter: {
      query: {
        clubAddress: 'clubAddress'
      }
    }
  },
  decorators: [
    (Story) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Story />
        </Provider>
      </ApolloProvider>
    )
  ]
};

const Template = (args) => {
  return <ConfirmMemberAllocations {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  preview: true,
  memberAllocation: '83948',
  newOwnership: 58,
  tokensToMintOrBurn: 83948,
  newTotalSupply: 30000,
  symbol: '✺RACA',
  totalSupply: 20000,
  memberToUpdate: {
    clubTokens: '3455',
    memberAddress: '0x9c6ce69f349430d31a2bfbe5a052fc3e48ad28cf',
    ownershipShare: 5
  }
};
