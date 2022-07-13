import { TokenItemsLoadingSection } from '@/components/tokenSelect/TokenItemDetails';
import { store } from '@/state/index';
import { Story } from '@storybook/react';
import { Provider } from 'react-redux';

export default {
  title: '2. Atoms/Token Items Loading Section',
  component: TokenItemsLoadingSection,
  decorators: [
    (Story: React.FC): React.ReactElement => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
};

const Template: Story = (args) => (
  <div className="max-w-564 mx-auto align-middle">
    <TokenItemsLoadingSection {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  symbol: 'ETH',
  name: 'Ethereum',
  logoURI: '/images/ethereum-logo.svg',
  showCheckMark: false
};
