import { ProgressState } from '@/components/progressCard';
import ModifyMemberClubTokens from '@/containers/managerActions/modifyMemberAllocation/ModifyMemberClubTokens';
import { store } from '@/state/index';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useState } from 'react';
import { Provider } from 'react-redux';

const client = new ApolloClient({
  uri: '#',
  cache: new InMemoryCache()
});

export default {
  title:
    '4. Organisms/Cap Table Management/Modals/Modify Member Tokens/Modify member allocation',
  parameters: {
    nextRouter: {
      query: {
        clubAddress: 'clubAddress'
      }
    }
  },
  decorators: [
    (Story) => (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Story />
        </Provider>
      </ApolloProvider>
    )
  ],
  argTypes: {
    state: {
      options: [
        ProgressState.FAILURE,
        ProgressState.PENDING,
        ProgressState.SUCCESS,
        ProgressState.CONFIRM
      ],
      control: { type: 'select' }
    }
  }
};

const data = [
  {
    clubTokens: '3455',
    memberAddress: '0x9c6ce69f349430d31a2bfbe5a052fc3e48ad28cf',
    ownershipShare: 5
  },
  {
    clubTokens: '455',
    memberAddress: '0xe4b343944C8da40E0FFA5ACadD27EA12fe608C3B',
    ownershipShare: 20
  },
  {
    clubTokens: '55',
    memberAddress: '0xBCf2708F4Ca796cf87cEeCe81e5792Be13Ca2D79',
    ownershipShare: 1
  },
  {
    clubTokens: '5',
    memberAddress: '0xd54f916AEBD6B5056127165f3349e7E7A8c86D32',
    ownershipShare: 1
  },
  {
    clubTokens: '100',
    memberAddress: '0xe0bEA09d561bD0fCB0cF45576C96382c8f87a6c8',
    ownershipShare: 7
  },
  {
    clubTokens: '200',
    memberAddress: '0xBF9C9FBd222d547A7D25A58D01D3cd1515335Db0',
    ownershipShare: 10
  },
  {
    clubTokens: '4999',
    memberAddress: '0xA4B7C3d05A2E1938f825B29c61de1bc943565bE6',
    ownershipShare: 40
  },
  {
    clubTokens: '3000',
    memberAddress: '0xA596dd3bC192990174fF2eC7f844f4225e20f61b',
    ownershipShare: 35
  }
];

const Template = (args) => {
  const [showModifyCapTable, setShowModifyCapTable] = useState(true);
  const [member, setMember] = useState(
    '0x9c6ce69f349430d31a2bfbe5a052fc3e48ad28cf'
  );
  const [memberAllocation, setMemberAllocation] = useState('');

  const handleAmountChange = (e) => {
    const amount = e.target.value;
    setMemberAllocation(amount);
  };

  return (
    <ModifyMemberClubTokens
      {...args}
      showModifyCapTable={showModifyCapTable}
      setShowModifyCapTable={setShowModifyCapTable}
      member={member}
      setMember={setMember}
      memberAllocation={memberAllocation}
      handleAmountChange={handleAmountChange}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  memberAddressToUpdate: '0x9c6ce69f349430d31a2bfbe5a052fc3e48ad28cf',
  showModifyCapTable: true,
  memberList: data,
  clearModalFields: () => {
    return;
  },
  memberAllocationError: '',
  handleSubmit: () => {
    return;
  }
};
