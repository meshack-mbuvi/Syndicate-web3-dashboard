import { Provider } from 'react-redux';
import { store } from '@/state/index';
import TokenSelectModal, {
  ITokenModal,
  TokenModalVariant
} from '@/components/tokenSelect/TokenSelectModal';
import { useArgs } from '@storybook/addons';
import { Story } from '@storybook/react';

export default {
  title: '4. Organisms/Token Select Modal',
  decorators: [
    (Story: React.FC): React.ReactElement => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
};

const Template: Story<ITokenModal> = (args) => {
  const [{ showModal }, updateArgs] = useArgs();
  return (
    <TokenSelectModal
      {...args}
      chainId={1}
      closeModal={() => updateArgs({ showModal: !showModal })}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  showModal: true
};

export const WithRecentlyUsed = Template.bind({});
WithRecentlyUsed.args = {
  showModal: true,
  variant: TokenModalVariant.RecentlyUsed
};
