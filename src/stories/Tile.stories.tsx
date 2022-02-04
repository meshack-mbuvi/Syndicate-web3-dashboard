import { Tile, TileAction, TileState } from '@/components/tile';
import React from 'react';


export default {
  title: 'Atoms/Tile',
  component: Tile,
  argTypes: {
    state: {
      control: { type: 'select' },
    },
    action: {
        control: { type: 'select' },
      },
  },
};

const Template = (args) => <Tile {...args}/>;

export const Default = Template.bind({});
Default.args = {
  state: TileState.UNSELECTED,
  title: "Lorum ipsum dolor"
}; 

export const Create = Template.bind({});
Create.args = {
  state: TileState.UNSELECTED,
  action: TileAction.CREATE,
  title: "Lorum ipsum dolor",
}; 

export const Radio = Template.bind({});
Radio.args = {
  state: TileState.UNSELECTED,
  action: TileAction.RADIO,
  title: "Lorum ipsum dolor",
  subTitle: "Subtitle"
}; 