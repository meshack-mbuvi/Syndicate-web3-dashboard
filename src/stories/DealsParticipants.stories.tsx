import { DealsParticipants } from '@/features/deals/components/participants';

export default {
  title: '3. Molecules/Deals/Participants'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return <DealsParticipants {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  addressOfLeader: '0x9DF90SDSF9S',
  participants: [
    {
      ensName: 'john.eth',
      address: '0x9DF90SDSF9S',
      amount: 1,
      joinedDate: 'Nov 5, 22',
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      address: '0xDF990SJDSF9S',
      joinedDate: 'Nov 5, 22',
      amount: 2,
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      ensName: 'john.eth',
      address: '0xDFJK90SDSF9S',
      joinedDate: 'Nov 5, 22',
      amount: 2,
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      ensName: 'joe.eth',
      address: '0xJDF90SDSF9S',
      joinedDate: 'Nov 5, 22',
      amount: 10,
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      address: '0xDFH90SDSF9S',
      joinedDate: 'Nov 5, 22',
      amount: 2,
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      ensName: 'john.eth',
      address: '0xDF90SDSF9S',
      joinedDate: 'Nov 5, 22',
      amount: 3,
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      ensName: 'john.eth',
      address: '0xDF990SDSF9S',
      joinedDate: 'Nov 5, 22',
      amount: 1,
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    }
  ]
};

export const SingleBadge = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
SingleBadge.args = {
  participants: [
    {
      ensName: 'john.eth',
      address: '0x9DF90SDSF9S',
      joinedDate: 'Nov 5, 22',
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      address: '0xDF990SJDSF9S',
      joinedDate: 'Nov 5, 22',
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      ensName: 'john.eth',
      address: '0xDFJK90SDSF9S',
      joinedDate: 'Nov 5, 22',
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      ensName: 'john.eth',
      address: '0xJDF90SDSF9S',
      joinedDate: 'Nov 5, 22',
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      address: '0xDFH90SDSF9S',
      joinedDate: 'Nov 5, 22',
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      ensName: 'john.eth',
      address: '0xDF90SDSF9S',
      joinedDate: 'Nov 5, 22',
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    },
    {
      ensName: 'john.eth',
      address: '0xDF990SDSF9S',
      joinedDate: 'Nov 5, 22',
      dealAddress:
        '0x5e3d4545afda8da89a6da42ec4793fd3c4b45972290ba45b83d095337880d796'
    }
  ]
};

export const NoParticipants = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
NoParticipants.args = {
  participants: []
};
