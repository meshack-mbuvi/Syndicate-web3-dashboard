import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ClubStillOpenModal } from '@/containers/managerActions/mintAndShareTokens/ClubStillOpenModal';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title:
    'Molecules/Cap Table Management/Modals/Add Member/Club Still Open Modal',
  decorators: [
    (Story: any) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Story />
        </Provider>
      </ApolloProvider>
    )
  ],
  parameters: {
    nextRouter: {
      query: {
        clubAddress: '0x9c6ce69f349430D31a2Bfbe5A052fc3e48AD28cf'
      }
    }
  }
};

const Template = (args: any) => {
  return <ClubStillOpenModal {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  showClubStillOpenModal: true,
  setShowClubStillOpenModal: () => {
    return;
  },
  handleCloseClubPostMint: () => {
    return;
  }
};
