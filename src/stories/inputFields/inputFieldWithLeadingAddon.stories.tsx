import {
  InputWithLeadingAddon,
  InputWithLeadingAddonProps
} from '@/components/inputs';

export default {
  title: '2. Atoms/Input Field/With Leading Addon',
  component: InputWithLeadingAddon,
  argTypes: {
    isButtonActive: {
      table: {
        type: { summary: 'boolean' }
      }
    }
  }
};

const Template = (args: InputWithLeadingAddonProps) => (
  <InputWithLeadingAddon {...args} />
);

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  label: 'Field name',
  addOn: '✺',
  value: null,
  placeholderLabel: 'Placeholder label',
  icon: '/images/token-gray-4.svg',
  extraClasses: ''
};

export const MoreInfo = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
MoreInfo.args = {
  addon: '✺',
  value: null,
  placeholderLabel: 'Placeholder label',
  addOn: 'Button',
  icon: '/images/token-gray-4.svg',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  extraClasses: ''
};

export const Error = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Error.args = {
  addon: '✺',
  value: null,
  placeholderLabel: 'Placeholder label',
  addOn: 'Button',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  isInErrorState: true,
  icon: '/images/token-gray-4.svg',
  extraClasses: '',
  error: 'Error message'
};
