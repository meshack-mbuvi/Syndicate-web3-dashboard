import { SimpleTile, TileElevation } from '@/components/tile/simpleTile';

export default {
  title: 'Atoms/Simple Tile',
  argTypes: {
    state: {
      control: { type: 'select' }
    },
    action: {
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => {
  // const [state, setState] = useState(TileState.UNSELECTED);
  return <SimpleTile {...args}>{args.label}</SimpleTile>;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  // title: 'Lorum ipsum dolor'
  label: 'Label',
  addOn: 'Add on',
  elevation: TileElevation.SECONDARY
};
