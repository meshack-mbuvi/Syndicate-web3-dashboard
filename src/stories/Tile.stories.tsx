import { Tile, TileAction, TileState } from '@/components/tile';
import React, { useState } from 'react';

export default {
  title: 'Atoms/Tile',
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

const Template = (args: any) => {
  const [state, setState] = useState(TileState.UNSELECTED);
  return <Tile state={state} handleClick={setState} {...args} />;
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  title: 'Lorum ipsum dolor'
};

export const Create = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Create.args = {
  action: TileAction.CREATE,
  title: 'Lorum ipsum dolor'
};

export const Radio = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Radio.args = {
  action: TileAction.RADIO,
  title: 'Lorum ipsum dolor',
  subTitle: 'Subtitle'
};

export const Subtitle = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Subtitle.args = {
  title: 'Lorum ipsum dolor',
  subTitle: 'Subtitle'
};
