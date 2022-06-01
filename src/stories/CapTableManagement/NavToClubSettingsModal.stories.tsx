import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/state/index';
import NavToClubSettingsModal from '@/containers/managerActions/mintAndShareTokens/NavToClubSettingsModal';

export default {
  title:
    'Molecules/Cap Table Management/Modals/Add Member/Navigate To Club Settings Modal',
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ],
  parameters: {
    nextRouter: {
      query: {
        clubAddress: '0x9c6ce69f349430D31a2Bfbe5A052fc3e48AD28cf'
      }
    }
  }
};

const Template = (args) => {
  return <NavToClubSettingsModal {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  showMintNavToClubSettings: true,
  setShowMintNavToClubSettings: () => {
    return;
  }
};
