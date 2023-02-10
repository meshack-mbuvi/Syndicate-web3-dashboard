import { CollectiveHeader } from '@/containers/collectives/shared/collectiveHeader';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import ConnectWallet from '@/components/connectWallet';
import { Provider } from 'react-redux';
import { store } from '@/state/index';

export default {
  title: 'Molecules/Collectives/Collective Header',
  decorators: [
    (Story: any) => (
      <Provider store={store}>
        <ConnectWalletProvider>
          <Story />
          <ConnectWallet />
        </ConnectWalletProvider>
      </Provider>
    )
  ]
};

const Template = (args: any) => {
  return <CollectiveHeader {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  collectiveName: 'Alpha Beta Punks',
  links: {
    externalLink: '/',
    openSea: '/'
  }
};
