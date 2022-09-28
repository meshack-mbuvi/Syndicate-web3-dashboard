import { SimpleTable } from '@/components/simpleTable';

export default {
  title: '3. Molecules/Table/Simple',
  decorators: [
    (Story: any): React.ReactElement => (
      <div style={{ margin: '0rem' }}>
        <Story />
      </div>
    )
  ]
};

const Template = (args: any) => {
  return <SimpleTable {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
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
