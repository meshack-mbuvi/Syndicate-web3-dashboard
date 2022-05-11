import {
  ProgressDescriptor,
  ProgressDescriptorState
} from '@/components/progressDescriptor';

export default {
  title: '3. Molecules/Progress Descriptor'
};

const Template = (args) => <ProgressDescriptor {...args} />;

export const Pending = Template.bind({});
Pending.args = {
  title: 'Distributing 40.0000 ETH',
  description:
    'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set.',
  state: ProgressDescriptorState.PENDING
};

export const Success = Template.bind({});
Success.args = {
  title: 'Action successful message',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  state: ProgressDescriptorState.SUCCESS
};

export const Failure = Template.bind({});
Failure.args = {
  title: 'Distributing 40.0000 ETH',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  state: ProgressDescriptorState.FAILURE
};

export const RequiresUserAction = Template.bind({});
RequiresUserAction.args = {
  title: 'Waiting for wallet',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  state: ProgressDescriptorState.PENDING,
  requiresUserAction: true
};

export const ExternalLink = Template.bind({});
ExternalLink.args = {
  title: 'Distributing 40.0000 ETH',
  description:
    'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set.',
  state: ProgressDescriptorState.PENDING,
  link: { label: 'External link', URL: 'http://storybook.syndicate.io' }
};
