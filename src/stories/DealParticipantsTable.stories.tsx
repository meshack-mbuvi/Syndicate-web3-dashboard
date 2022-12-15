import { Status } from '@/components/statusChip';
import { DealsParticipantsTable } from '@/features/deals/components/participants/table';

export default {
  title: '4. Organisms/Deals/Participants Table'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return (
    <DealsParticipantsTable
      {...args}
      handleParticipantAcceptanceClick={(index) => {
        alert(`Clicked Accept on row ${index + 1}`);
      }}
      handleParticipantRejectionClick={(index) => {
        alert(`Clicked Reject on row ${index + 1}`);
      }}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  totalParticipantsAmount: 100000,
  tokenSymbol: 'USDC',
  tokenLogo: '/images/prodTokenLogos/USDCoin.svg',
  participants: [
    {
      ensName: 'alex.eth',
      address: '0xDFOMD94NMDSKM3D',
      joinedDate: '12/34/22',
      status: Status.ACCEPTED,
      contributionAmount: 8000
    },
    {
      ensName: 'john.eth',
      address: '0xDMFMD94NMDSKM3D',
      joinedDate: '12/34/22',
      status: Status.REJECTED,
      contributionAmount: 4000
    },
    {
      ensName: 'alice.eth',
      address: '0x948NMDSKM3D',
      joinedDate: '12/34/22',
      status: Status.ACCEPTED,
      contributionAmount: 7000
    },
    {
      ensName: 'bob.eth',
      address: '0xDF0MD94NMDSKM3D',
      joinedDate: '12/34/22',
      status: Status.ACCEPTED,
      contributionAmount: 12000
    }
  ]
};
