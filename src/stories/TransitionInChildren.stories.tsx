import TransitionInChildren from '@/components/transition/transitionInChildren';

export default {
  title: 'Animations/Transition-In Children'
};

const Template = (args: any) => {
  const elementStyles =
    'mx-4 border-dashed border border-gray-syn6 bg-gray-syn8 p-6 text-center uppercase tracking-px font-medium text-sm text-gray-syn5 rounded-lg';
  // const [isSwitchOn, setIsSwitchOn] = useState(false);
  return (
    <TransitionInChildren {...args}>
      <div className={`w-3/4 h-80 bg-gray-syn6 border ${elementStyles}`}>
        <div className="vertically-center">Content A</div>
      </div>
    </TransitionInChildren>
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {
  isChildVisible: true
};
