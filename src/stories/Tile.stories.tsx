import { Tile, TileAction, TileState } from '@/components/tile';
import React, { useState } from 'react';

export default {
  title: '2. Atoms/Tile',
  component: Tile,
  argTypes: {
    state: {
      control: { type: 'select' }
    },
    action: {
      control: { type: 'select' }
    }
  }
};

const Template = (args) => {
  const [state, setState] = useState(TileState.UNSELECTED);
  return <Tile state={state} handleClick={setState} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Lorum ipsum dolor'
};

export const Create = Template.bind({});
Create.args = {
  action: TileAction.CREATE,
  title: 'Lorum ipsum dolor'
};

export const Radio = Template.bind({});
Radio.args = {
  action: TileAction.RADIO,
  title: 'Lorum ipsum dolor',
  subTitle: 'Subtitle'
};

export const Subtitle = Template.bind({});
Subtitle.args = {
  title: 'Lorum ipsum dolor',
  subTitle: 'Subtitle'
};
