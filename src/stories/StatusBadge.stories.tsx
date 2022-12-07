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
  return <StatusBadge {...args} />;
};

export const Active = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Active.args = {
  depositsEnabled: false
};

export const FullyDeposited = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
FullyDeposited.args = {
  depositsEnabled: true,
  depositExceedTotal: true
};

export const DepositsEnabled = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
DepositsEnabled.args = {
  depositsEnabled: true
};

export const ClaimClubTokens = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
ClaimClubTokens.args = {
  claimEnabled: true,
  isManager: false
};

export const AirdropEnabled = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
AirdropEnabled.args = {
  claimEnabled: true,
  isManager: true
};

export const Distributing = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Distributing.args = {
  isDistributing: true
};

export const DealOpen = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
DealOpen.args = {
  isDeal: true,
  isOpenToAllocations: true,
  dealEndTime: 1645092424000
};

export const DealClosed = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
DealClosed.args = {
  isDeal: true,
  isOpenToAllocations: true,
  dealEndTime: 1645092424000
};
