import {
  CollectiveActivity,
  CollectiveActivityType
} from '@/components/collectives/activity';

export default {
  title: '3. Molecules/Collectives/Activity'
};

const Template = (args) => {
  return <CollectiveActivity {...args} />;
};

export const Recieved = Template.bind({});
Recieved.args = {
  activityType: CollectiveActivityType.RECIEVED,
  profile: {
    picture: '/images/collectives/alex.jpg',
    username: 'alexzandi'
  },
  timeStamp: '2h ago'
};

export const Transfer = Template.bind({});
Transfer.args = {
  activityType: CollectiveActivityType.TRANSFER,
  transfer: {
    fromUsername: 'alexzandi',
    toUsername: 'nathan'
  },
  timeStamp: '2h ago'
};

export const Sale = Template.bind({});
Sale.args = {
  activityType: CollectiveActivityType.SALE,
  sale: {
    fromUsername: 'alice',
    toUsername: 'bob',
    tokenAmount: 1.2,
    tokenSymbol: 'ETH',
    tokenIcon: '/images/token.svg'
  },
  externalLink: 'http://storybook.syndicate.io'
};

export const List = Template.bind({});
List.args = {
  activityType: CollectiveActivityType.LIST,
  list: {
    username: 'alex',
    tokenAmount: 1.2,
    tokenSymbol: 'ETH',
    tokenIcon: '/images/token.svg'
  },
  timeStamp: '2h ago'
};

export const Offer = Template.bind({});
Offer.args = {
  activityType: CollectiveActivityType.OFFER,
  offer: {
    username: 'alex',
    tokenAmount: 1.2,
    tokenSymbol: 'ETH',
    tokenIcon: '/images/token.svg'
  },
  timeStamp: '2h ago'
};
