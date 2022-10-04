import { AddressUploader } from '@/components/uploaders/addressUploader';
import React, { useState } from 'react';

export default {
  title: '4. Organisms/Address Uploader',
  argTypes: {
    handleCancelUpload: {
      action: 'Clicked Delete'
    }
  }
};

const Template = (args: any) => {
  const [textFieldValue, setTextFieldValue] = useState(
    '0x50B8E0Bd4FAF9E98AFaEB0f0c4a008552f03D3aE, 0x50B8E0Bd4FAF9E98AFaEB0f0c4a008552f03D3aE'
  );
  return (
    <AddressUploader
      {...args}
      handleTextInputChange={(e) => {
        const value = e.target.value;
        setTextFieldValue(value);
        args.handleTextInputChange(e);
      }}
      textInputValue={textFieldValue}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  title: 'Airdrop 1 ✺ABC to',
  helperText:
    'Invite members by minting & sending the community token to their wallets. You can distribute to more members anytime later. Add multiple addresses at once to minimize airdrop gas fees.',
  progressPercent: 3,
  fileInfo: { name: 'file.csv', successText: '32 addresses' },
  customClasses: ''
};
