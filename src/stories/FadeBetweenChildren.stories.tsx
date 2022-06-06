import FadeBetweenChildren from '@/components/fadeBetweenChildren';

export default {
  title: '2. Atoms/Fade Between Children',
  argTypes: {
    visibleChildIndex: {
      options: [0, 1, 2],
      control: { type: 'select' }
    }
  }
};

const Template = (args) => {
  const elementStyles =
    'mx-4 border-dashed border border-gray-syn6 bg-gray-syn8 p-6 text-center uppercase tracking-px font-medium text-sm text-gray-syn5 rounded-lg';

  return (
    <FadeBetweenChildren {...args}>
      <div className={`w-3/4 h-80 bg-gray-syn6 border ${elementStyles}`}>
        <div className="vertically-center">Content A</div>
      </div>
      <div className={`w-3/4 h-80 bg-blue-deepAzure border ${elementStyles}`}>
        <div className="vertically-center">Content B</div>
      </div>
      <div className={`w-3/4 h-80 bg-green-darker border ${elementStyles}`}>
        <div className="vertically-center">Content C</div>
      </div>
    </FadeBetweenChildren>
  );
};

export const Default = Template.bind({});
Default.args = {
  visibleChildIndex: 0
};
