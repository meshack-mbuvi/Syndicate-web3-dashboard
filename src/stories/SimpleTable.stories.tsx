import { SimpleTable } from '@/components/simpleTable';
import { useState } from 'react';

export default {
  title: '3. Molecules/Simple Table',
  decorators: [
    (Story): React.ReactElement => (
      <div style={{ margin: '0rem' }}>
        <Story />
      </div>
    )
  ]
};

const Template = (args) => {
  return <SimpleTable {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  rows: [
    {
      title: 'Row 1',
      value: 'Value 1',
      externalLink: 'https://storybook.syndicate.io'
    },
    {
      title: 'Row 2',
      value: 'Value 2',
      externalLink: 'https://storybook.syndicate.io'
    },
    {
      title: 'Row 3',
      value: 'Value 3',
      externalLink: 'https://storybook.syndicate.io'
    },
    {
      title: 'Row 4',
      value: 'Value 4',
      externalLink: 'https://storybook.syndicate.io'
    },
    {
      title: 'Row 5',
      value: 'Value 5',
      externalLink: 'https://storybook.syndicate.io'
    }
  ]
};
