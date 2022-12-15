import { Accordion } from '@/components/accordion';
import { CTAButton, CTAStyle } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { H4 } from '@/components/typography';
import { useState } from 'react';

interface Props {
  handleReviewCommitmentsClick: () => void;
  handleCancelAndGoBackClick: () => void;
}

const DealCloseConfirmModal: React.FC<Props> = ({
  handleReviewCommitmentsClick,
  handleCancelAndGoBackClick
}) => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<
    number | null
  >(null);
  return (
    <Modal
      show={true}
      modalStyle={ModalStyle.DARK}
      customClassName="p-8 max-w-112"
      showHeader={false}
      showCloseButton={false}
    >
      <>
        <H4 extraClasses="mb-7 text-center">
          Are you ready to close this deal?
        </H4>
        <Accordion
          items={[
            {
              title: 'What happens to the pre-commits?',
              content: 'Content TBD'
            },
            {
              title: 'What heppens to the deal page?',
              content: 'Content TBD'
            },
            {
              title: 'Are participants expecting anything else?',
              content: 'Content TBD'
            }
          ]}
          visibleItemIndex={activeAccordionIndex}
          handleVisibleItemChange={setActiveAccordionIndex}
          titleClassName="text-base"
          extraClasses="mt-7"
        />
        <div className="space-y-4 mt-6">
          <CTAButton fullWidth onClick={handleReviewCommitmentsClick}>
            Review commitments
          </CTAButton>
          <CTAButton
            fullWidth
            style={CTAStyle.DARK_OUTLINED}
            onClick={handleCancelAndGoBackClick}
          >
            Cancel and go back
          </CTAButton>
        </div>
      </>
    </Modal>
  );
};

export default DealCloseConfirmModal;
