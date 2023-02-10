import TokenItemDetails, {
  TokenDetailsProps
} from '@/components/tokenSelect/TokenItemDetails';
import { store } from '@/state/index';
import { Story } from '@storybook/react';
import { Provider } from 'react-redux';

export default {
  title: 'Molecules/Token Select/Item Details',
  component: TokenItemDetails,
  decorators: [
    (Story: React.FC): React.ReactElement => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
};

const Template: Story<TokenDetailsProps> = (args) => (
  <div className="max-w-564 mx-auto align-middle">
    <TokenItemDetails {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  symbol: 'ETH',
  name: 'Ethereum',
  logoURI: '/images/ethereum-logo.svg',
  showCheckMark: false
};

export const Selected = Template.bind({});
Selected.args = {
  symbol: 'ETH',
  name: 'Ethereum',
  logoURI: '/images/ethereum-logo.svg',
  showCheckMark: true
};
