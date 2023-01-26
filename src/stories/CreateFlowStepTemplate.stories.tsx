import { CreateFlowStepTemplate } from '@/templates/createFlowStepTemplate';
import { useState } from 'react';

export default {
  title: 'Templates/Create'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(0);
  return (
    <>
      <DemoCreateFlowStepTemplate
        activeInputIndex={activeInputIndex ? activeInputIndex : 0}
        handleInputIndexChange={setActiveInputIndex}
        {...args}
      />
    </>
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  isReview: false,
  hideCallouts: false,
  title: 'Title',
  showNextButton: false
};

// Storybook hangs if not wrapping it in a component

interface Props {
  activeInputIndex: number;
  handleInputIndexChange: (index: number) => void;
  isReview: boolean;
  hideCallouts: boolean;
  title: string;
  showNextButton: boolean;
}

const DemoCreateFlowStepTemplate: React.FC<Props> = ({
  activeInputIndex = 0,
  handleInputIndexChange,
  isReview,
  hideCallouts,
  title,
  showNextButton
}) => {
  const inputClasses =
    'hover:border-gray-syn3 transition-all text-left text-gray-syn5 w-full uppercase px-4 py-5 bg-gray-syn8 border border-gray-syn7 rounded-lg';
  return (
    <CreateFlowStepTemplate
      title={title}
      activeInputIndex={activeInputIndex}
      inputs={[
        {
          input: (
            <button
              className={`${inputClasses}`}
              onClick={() => {
                handleInputIndexChange(0);
              }}
            >
              INPUT 1
            </button>
          ),
          label: 'Input label',
          info: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
          reviewValue: 'Input value'
        },
        {
          input: (
            <button
              className={`${inputClasses}`}
              onClick={() => {
                handleInputIndexChange(1);
              }}
            >
              INPUT 2
            </button>
          ),
          label: 'Input label',
          info: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          reviewValue: 'Input value'
        }
      ]}
      isReview={isReview}
      showNextButton={showNextButton}
      hideCallouts={hideCallouts}
      isNextButtonDisabled={false}
    />
  );
};
