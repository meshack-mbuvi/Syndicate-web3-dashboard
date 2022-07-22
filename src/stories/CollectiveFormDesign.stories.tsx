import { CollectiveFormDesign } from '@/components/collectives/create/design';
import { useState } from 'react';

export default {
  title: '4. Organisms/Collectives/Create/Design'
};

const Template = (args) => {
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
Default.args = {
  isContinueButtonActive: false,
  handleContinue: () => {}
};
