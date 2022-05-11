import { ConfirmDistributionsModal } from '@/components/distributions/confirmModal';
import {
  ProgressDescriptor,
  ProgressDescriptorState
} from '@/components/progressDescriptor';

export default {
  title: '4. Organisms/Confirm Distributions Modal'
};

const Template = (args) => {
  // Example states for this story
  const progressDescriptors = [
    <ProgressDescriptor
      title="Approving ETH"
      description="This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. "
      state={ProgressDescriptorState.PENDING}
      key={0}
    />,
    <ProgressDescriptor
      title="Confirm ETH distribution from your wallet"
      description="Distributions are irreversible"
      state={ProgressDescriptorState.PENDING}
      requiresUserAction={true}
      key={0}
    />,
    <ProgressDescriptor
      title="Approve ETH from your wallet"
      state={ProgressDescriptorState.PENDING}
      requiresUserAction={true}
      key={0}
    />
  ];

  return (
    <ConfirmDistributionsModal {...args}>
      {progressDescriptors[args.activeStepIndex]}
    </ConfirmDistributionsModal>
  );
};

export const Default = Template.bind({});
Default.args = {
  steps: [
    {
      title: 'Approve UNI',
      description:
        'Before distributing, you need to allow the protocol to use your ETH. You only need to do this once per asset.',
      isInErrorState: false
    },
    {
      title: 'Distribute 40.0000 UNI',
      description: 'Lorum ipsum dolor lorum ipsum dolor',
      isInErrorState: false
    },
    {
      title: 'Approve USDC',
      description: 'Lorum ipsum dolor lorum ipsum dolor',
      isInErrorState: true
    },
    {
      title: 'Distribute 260,253.56 USDC',
      description: 'Lorum ipsum dolor lorum ipsum dolor',
      isInErrorState: false
    }
  ],
  activeStepIndex: 1,
  isModalVisible: true
};
