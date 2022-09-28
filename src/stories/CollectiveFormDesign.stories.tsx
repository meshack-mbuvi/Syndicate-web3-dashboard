import { CollectiveFormDesign } from '@/components/collectives/create/design';
import { useState } from 'react';

export default {
  title: '4. Organisms/Collectives/Create/Design'
};

const Template = (args: any) => {
  const [nameValue, setNameValue] = useState('');
  const [tokenValue, setTokenValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  return (
    <CollectiveFormDesign
      nameValue={nameValue}
      handleNameChange={setNameValue}
      tokenSymbolValue={tokenValue}
      handleTokenSymbolChange={setTokenValue}
      descriptionValue={descriptionValue}
      handleDescriptionChange={setDescriptionValue}
      {...args}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  isContinueButtonActive: false,
  handleContinue: () => {
    null;
  }
};
