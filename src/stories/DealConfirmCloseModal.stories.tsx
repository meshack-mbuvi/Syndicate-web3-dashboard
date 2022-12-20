import DealCloseConfirmModal from '@/features/deals/components/close/confirm';

export default {
  title: '4. Organisms/Deals/Close/Confirm'
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Template = (args: any) => {
  return (
    <DealCloseConfirmModal
      show={true}
      handleCancelAndGoBackClick={() => {
        alert('Clicked Cancel and go back');
      }}
      handleReviewCommitmentsClick={() => {
        alert('Clicked Review commitments');
      }}
    />
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '() => Elem... Remove this comment to see the full error message
Default.args = {};
