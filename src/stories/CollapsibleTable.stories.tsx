import { CollapsibleTable } from '@/components/collapsibleTable';

export default {
  title: '3. Molecules/Table/Collapsible'
};

const Template = (args) => {
  return <CollapsibleTable {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  rows: [
    {
      title: 'Row 1',
      value: 'Value 1'
    },
    {
      title: 'Row 2',
      value: 'Value 2'
    },
    {
      title: 'Row 3',
      value: 'Value 3'
    },
    {
      title: 'Row 4',
      value:
        'Alpha Beta Punks dreamcatcher vice affogato sartorial roof party unicorn wolf. Heirloom disrupt PBR&B normcore flexitarian bitters tote bag coloring book cornhole. Portland fixie forage selvage, disrupt +1 dreamcatcher meh ramps poutine stumptown letterpress lyft fam. Truffaut put a bird on it asymmetrical, gastropub master cleanse fingerstache succulents swag flexitarian bespoke thundercats kickstarter chartreuse.'
    },
    {
      title: 'Row 5',
      value: 'Value 5'
    }
  ]
};
