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
  participants: [
    { ensName: 'john.eth', address: '0x9DF90SDSF9S', joinedDate: 'Nov 5, 22' },
    { address: '0xDF990SJDSF9S', joinedDate: 'Nov 5, 22' },
    { ensName: 'john.eth', address: '0xDFJK90SDSF9S', joinedDate: 'Nov 5, 22' },
    { ensName: 'john.eth', address: '0xJDF90SDSF9S', joinedDate: 'Nov 5, 22' },
    { address: '0xDFH90SDSF9S', joinedDate: 'Nov 5, 22' },
    { ensName: 'john.eth', address: '0xDF90SDSF9S', joinedDate: 'Nov 5, 22' },
    { ensName: 'john.eth', address: '0xDF990SDSF9S', joinedDate: 'Nov 5, 22' }
  ]
};

export const NoParticipants = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
NoParticipants.args = {
  participants: []
};
