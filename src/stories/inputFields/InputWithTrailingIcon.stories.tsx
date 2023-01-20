import { InputWithTrailingIcon } from '@/components/inputs';

export default {
  title: '2. Atoms/Input Field/With Trailing Icon',
  component: InputWithTrailingIcon,
  argTypes: {
    isButtonActive: {
      table: {
        type: { summary: 'boolean' }
      }
    }
  }
};

const Template = (args: any) => <InputWithTrailingIcon {...args} />;

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  icon: '/images/token-gray-4.svg',
  value: null,
  placeholderLabel: 'Placeholder label',
  addOn: 'Button',
  extraClasses: ''
};

export const MoreInfo = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
MoreInfo.args = {
  icon: '/images/token-gray-4.svg',
  value: null,
  placeholderLabel: 'Placeholder label',
  addOn: 'Button',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  extraClasses: ''
};

export const Error = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Error.args = {
  icon: '/images/token-gray-4.svg',
  value: null,
  placeholderLabel: 'Placeholder label',
  addOn: 'Button',
  infoLabel:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  isInErrorState: true,
  extraClasses: ''
};
