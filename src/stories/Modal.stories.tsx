import Modal, { ModalStyle } from '@/components/modal';
import { E1 } from '@/components/typography';

export default {
  title: 'Molecules/Modal'
};

const Template = (args: any) => {
  return (
    <Modal isMaxHeightScreen={true} modalStyle={ModalStyle.DARK} {...args}>
      <div
        className="rounded-md border-dashed border-gray-syn6 h-96 border text-gray-syn4 bg-gray-syn7 bg-opacity-50"
        style={{
          height: `${args.contentPxHeight}px`
        }}
      >
        <E1 extraClasses="text-center vertically-center">Content</E1>
      </div>
    </Modal>
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '(args: any... Remove this comment to see the full error message
Default.args = {
  show: true,
  contentPxHeight: 400,
  title: ''
};
