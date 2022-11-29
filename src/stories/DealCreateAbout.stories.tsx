import { DealsCreateAbout } from '@/features/deals/components/create/about';
import { useState } from 'react';

export default {
  title: '5. Organisms/Deals/Create/About'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  const [title, handleTitleChange] = useState(null);
  const [details, handleDetailsChange] = useState(null);
  return (
    <DealsCreateAbout
      {...args}
      title={title}
      handleTitleChange={handleTitleChange}
      details={details}
      handleDetailsChange={handleDetailsChange}
      handleShuffle={() => {
        alert('Shuffle name');
      }}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {};

export const Error = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Error.args = {
  titleError: "Title can't be blank",
  detailsError: "Details can't be blank"
};
