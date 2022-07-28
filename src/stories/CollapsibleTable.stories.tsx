import { CollapsibleTable } from '@/components/collapsibleTable';
import { InputField } from '@/components/inputs/inputField';

export default {
  title: '3. Molecules/Table/Collapsible'
};

const Template = (args) => {
  return <CollapsibleTable {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  expander: { isExpandable: true },
  rows: [
    {
      title: 'Row 1',
      value: 'Value 1',
      edit: {
        isEditable: true,
        rowIndex: 0,
        handleEdit: () => null,
        inputField: <InputField />
      }
    },
    {
      title: 'Row 2',
      value: 'Value 2',
      edit: {
        isEditable: false
      }
    },
    {
      title: 'Row 3',
      value: 'Value 3',
      edit: {
        isEditable: false
      }
    },
    {
      title: 'Row 4',
      value:
        'Alpha Beta Punks dreamcatcher vice affogato sartorial roof party unicorn wolf. Heirloom disrupt PBR&B normcore flexitarian bitters tote bag coloring book cornhole. Portland fixie forage selvage, disrupt +1 dreamcatcher meh ramps poutine stumptown letterpress lyft fam. Truffaut put a bird on it asymmetrical, gastropub master cleanse fingerstache succulents swag flexitarian bespoke thundercats kickstarter chartreuse.',
      edit: {
        isEditable: false
      }
    },
    {
      title: 'Row 5',
      value: 'Value 5',
      edit: {
        isEditable: false
      }
    }
  ]
};
