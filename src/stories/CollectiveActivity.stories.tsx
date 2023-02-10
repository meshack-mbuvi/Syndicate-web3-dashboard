import {
  CollectiveActivity,
  CollectiveActivityType
} from '@/components/collectives/activity';

export default {
  title: 'Molecules/Collectives/Activity'
};

const Template = (args: any) => {
  return <CollectiveActivity {...args} />;
};

export const Received = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Received.args = {
  activityType: CollectiveActivityType.RECEIVED,
  profile: {
    picture: '/images/collectives/alex.jpg',
    username: 'alexzandi'
  },
  timeStamp: '2h ago'
};

export const Transfer = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Transfer.args = {
  activityType: CollectiveActivityType.TRANSFER,
  transfer: {
    fromUsername: 'alexzandi',
    toUsername: 'nathan'
  },
  timeStamp: '2h ago'
};

export const Sale = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
