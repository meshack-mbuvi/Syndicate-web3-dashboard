import StatusBadge from '@/components/syndicateDetails/statusBadge';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: '3. Molecules/Status Badge',
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
  return <StatusBadge {...args} />;
};

export const Active = Template.bind({});
Active.args = {
  depositsEnabled: false
};

export const FullyDeposited = Template.bind({});
FullyDeposited.args = {
  depositsEnabled: true,
  depositExceedTotal: true
};

export const DepositsEnabled = Template.bind({});
DepositsEnabled.args = {
  depositsEnabled: true
};

export const ClaimClubTokens = Template.bind({});
ClaimClubTokens.args = {
  claimEnabled: true,
  isManager: false
};

export const AirdropEnabled = Template.bind({});
AirdropEnabled.args = {
  claimEnabled: true,
  isManager: true
};

export const Distributing = Template.bind({});
Distributing.args = {
  isDistributing: true
};
