import TransitionBetweenChildren, {
  TransitionBetweenChildrenType
} from '@/components/transitionBetweenChildren';
import { Switch } from '@/components/switch';
import { useState } from 'react';

export default {
  title: '2. Atoms/Transition Between Children',
  argTypes: {
    visibleChildIndex: {
      options: [0, 1, 2],
      control: { type: 'select' }
    }
  }
};

const Template = (args: any) => {
  const elementStyles =
    'mx-4 border-dashed border border-gray-syn6 bg-gray-syn8 p-6 text-center uppercase tracking-px font-medium text-sm text-gray-syn5 rounded-lg';
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  return (
    <TransitionBetweenChildren {...args}>
      <div className={`w-3/4 h-80 bg-gray-syn6 border ${elementStyles}`}>
        <div className="vertically-center">Content A</div>
      </div>
      <div className={`w-3/4 h-80 bg-blue-deepAzure border ${elementStyles}`}>
        <div className="vertically-center">
          <div className="mb-4">Content B</div>
          <Switch
            isOn={isSwitchOn}
            onClick={() => {
              setIsSwitchOn(!isSwitchOn);
            }}
          />
        </div>
      </div>
      <div className={`w-3/4 h-80 bg-green-darker border ${elementStyles}`}>
        <div className="vertically-center">Content C</div>
      </div>
    </TransitionBetweenChildren>
  );
};

export const Fade = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Fade.args = {
  visibleChildIndex: 0,
  transitionType: TransitionBetweenChildrenType.FADE
};

export const Move = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Move.args = {
  visibleChildIndex: 0,
  transitionType: TransitionBetweenChildrenType.VERTICAL_MOVE
};
