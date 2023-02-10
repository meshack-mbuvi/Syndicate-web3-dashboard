import ConnectWallet from '@/components/connectWallet';
import { ConfirmDistributionsModal } from '@/components/distributions/confirmModal';
import {
  ProgressDescriptor,
  ProgressDescriptorState
} from '@/components/progressDescriptor';
import ConnectWalletProvider from '@/context/ConnectWalletProvider';
import { store } from '@/state';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title: 'Organisms/Distributions/Confirm Distributions Modal',
  decorators: [
    (Story: any) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ConnectWalletProvider>
            <Story />
            <ConnectWallet />
          </ConnectWalletProvider>
        </Provider>
      </ApolloProvider>
    )
  ]
};

const Template = (args: any) => {
  // Example states for this story
  const progressDescriptors = [
    <ProgressDescriptor
      title="Approving ETH"
      description="This could take anywhere from seconds to hours depending on network congestion and the gas fees you set. "
      state={ProgressDescriptorState.PENDING}
      key={0}
      transactionHash={''}
    />,
    <ProgressDescriptor
      title="Confirm UNI distribution from your wallet"
      description="Distributions are irreversible"
      state={ProgressDescriptorState.PENDING}
      requiresUserAction={true}
      key={0}
      transactionHash={''}
    />,
    <ProgressDescriptor
      title="Confirming UNI distribution from your wallet"
      description="Distributions are irreversible"
      state={ProgressDescriptorState.PENDING}
      requiresUserAction={true}
      key={0}
      transactionHash={
        '0xc582c527f87bb3e7e2346f1c361260099ee76d84d7183e5966724b4ef4da8f93'
      }
    />,
    <ProgressDescriptor
      title="Approve ETH from your wallet"
      state={ProgressDescriptorState.PENDING}
      requiresUserAction={true}
      key={0}
      transactionHash={''}
    />
  ];

  return (
    <ConfirmDistributionsModal {...args}>
      {progressDescriptors[args.activeStepIndex]}
    </ConfirmDistributionsModal>
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
