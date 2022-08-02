import { BadgeWithMembers } from '@/components/collectives/badgeWithMembers';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';

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
  return (
    <BadgeWithMembers
      {...{
        ...args,
        inviteLink:
          'https://syndicate.storybook.io/story/4-organisms-badge-with-members--default',
        admins: [
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          }
        ],
        members: [
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          },
          {
            profilePicture: '/images/collectives/alex.jpg',
            accountAddress: '0x0563A7aB3Da1171230A20aD5dbad6C8c8C0f8c'
          }
        ]
      }}
    />
  );
};

export const Admin = Template.bind({});
Admin.args = {
  isAdmin: true
};

export const Member = Template.bind({});
Member.args = {
  isMember: true
};

export const NonMember = Template.bind({});
NonMember.args = {
  isMember: false
};
