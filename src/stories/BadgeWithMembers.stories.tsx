import { BadgeWithMembers } from '@/components/collectives/badgeWithMembers';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: 'Organisms/Badge/With Members',
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Admin.args = {
  isAdmin: true
};

export const Member = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Member.args = {
  isMember: true
};

export const NonMember = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
NonMember.args = {
  isMember: false
};
