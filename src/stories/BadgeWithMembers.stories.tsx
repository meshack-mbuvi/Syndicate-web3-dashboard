import { Provider } from 'react-redux';
import { store } from '@/state/index';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BadgeWithMembers } from '@/components/collectives/badgeWithMembers';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: '4. Organisms/Badge/With Members',
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
  return <BadgeWithMembers {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  inviteLink:
    'https://syndicate.storybook.io/story/4-organisms-badge-with-members--default',
  admins: [
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi',
      maxClubsToDisplay: 3,
      alsoMemberOf: ['DUNE', 'FUNDFUND', 'VOLTCAP']
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi'
    }
  ],
  members: [
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi',
      maxClubsToDisplay: 3,
      alsoMemberOf: ['DUNE', 'FUNDFUND', 'VOLTCAP']
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi'
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi',
      maxClubsToDisplay: 3,
      alsoMemberOf: ['DUNE', 'FUNDFUND', 'VOLTCAP']
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi'
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi'
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi'
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi',
      maxClubsToDisplay: 3,
      alsoMemberOf: ['DUNE', 'FUNDFUND', 'VOLTCAP']
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi'
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi'
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi',
      maxClubsToDisplay: 3,
      alsoMemberOf: ['DUNE', 'FUNDFUND', 'VOLTCAP']
    },
    {
      profilePicture: '/images/collectives/alex.jpg',
      username: 'alexzandi'
    }
  ]
};
