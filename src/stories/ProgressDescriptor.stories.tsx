import {
  ProgressDescriptor,
  ProgressDescriptorState
} from '@/components/progressDescriptor';

export default {
  title: 'Molecules/Progress Descriptor'
};

const Template = (args: any) => <ProgressDescriptor {...args} />;

export const Pending = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Pending.args = {
  title: 'Distributing 40.0000 ETH',
  description:
    'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set.',
  state: ProgressDescriptorState.PENDING
};

export const Success = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Success.args = {
  title: 'Action successful message',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  state: ProgressDescriptorState.SUCCESS
};

export const Failure = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Failure.args = {
  title: 'Distributing 40.0000 ETH',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  state: ProgressDescriptorState.FAILURE
};

export const RequiresUserAction = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
RequiresUserAction.args = {
  title: 'Waiting for wallet',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  state: ProgressDescriptorState.PENDING,
  requiresUserAction: true
};

export const ExternalLink = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
ExternalLink.args = {
  title: 'Distributing 40.0000 ETH',
  description:
    'This could take anywhere from seconds to hours depending on network congestion and the gas fees you set.',
  state: ProgressDescriptorState.PENDING,
  link: { label: 'External link', URL: 'http://storybook.syndicate.io' }
};
