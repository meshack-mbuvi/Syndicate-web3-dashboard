import TokenSelectModal, {
  ITokenModal,
  TokenModalVariant
} from '@/components/tokenSelect/TokenSelectModal';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useArgs } from '@storybook/addons';
import { Story } from '@storybook/react';
import { Provider } from 'react-redux';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: '4. Organisms/Token Select Modal',
  decorators: [
    (Story: React.FC): React.ReactElement => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Story />
        </Provider>
      </ApolloProvider>
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
