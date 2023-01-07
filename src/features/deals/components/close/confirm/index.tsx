import { Accordion } from '@/components/accordion';
import { CTAButton, CTAType, CTAStyle } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { H4 } from '@/components/typography';
import { useState } from 'react';
import { DealEndType } from '../types';

interface Props {
  closeType?: DealEndType;
  show: boolean;
  handleContinueClick: () => void;
  handleCancelAndGoBackClick: () => void;
}

const DealActionConfirmModal: React.FC<Props> = ({
  closeType = DealEndType.EXECUTE,
  show,
  handleContinueClick,
  handleCancelAndGoBackClick
}) => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<
    number | null
  >(null);
  return (
    <Modal
      show={show}
      modalStyle={ModalStyle.DARK}
      customClassName="p-8 max-w-112"
      showHeader={false}
      showCloseButton={false}
    >
      <>
        <H4 extraClasses="mb-7 text-center">
          {closeType === DealEndType.EXECUTE
            ? 'Are you ready to close this deal?'
            : closeType === DealEndType.DISSOLVE
            ? 'Are you sure you want to dissolve this deal?'
            : closeType === DealEndType.WITHDRAW
            ? 'Are you sure you want to withdraw from this deal?'
            : ''}
        </H4>
        <Accordion
          items={[
            {
              title:
                closeType === DealEndType.WITHDRAW
                  ? 'What happens to my contribution?'
                  : 'What happens to the pre-commits?',
              content: 'Content TBD'
            },
            {
              title:
                closeType === DealEndType.EXECUTE
                  ? 'What heppens to the deal page?'
                  : closeType === DealEndType.DISSOLVE ||
                    closeType === DealEndType.WITHDRAW
                  ? 'Will this go on chain?'
                  : '',
              content: 'Content TBD'
            },
            {
              title:
                closeType === DealEndType.EXECUTE
                  ? 'Are participants expecting anything else?'
                  : closeType === DealEndType.DISSOLVE
                  ? 'How do I create a new deal?'
                  : closeType === DealEndType.WITHDRAW
                  ? 'Can I request contribution again later?'
                  : '',
              content: 'Content TBD'
            }
          ]}
          visibleItemIndex={activeAccordionIndex}
          handleVisibleItemChange={setActiveAccordionIndex}
          titleClassName="text-base"
          extraClasses="mt-7"
        />
        <div className="space-y-4 mt-6">
          {/* Primary CTA */}
          {closeType === DealEndType.EXECUTE ? (
            <CTAButton fullWidth onClick={handleContinueClick}>
              Review commitments
            </CTAButton>
          ) : closeType === DealEndType.DISSOLVE ? (
            <CTAButton
              fullWidth
              type={CTAType.ERROR}
              onClick={handleContinueClick}
            >
              Yes, delete deal
            </CTAButton>
          ) : closeType === DealEndType.WITHDRAW ? (
            <CTAButton
              fullWidth
              type={CTAType.ERROR}
              onClick={handleContinueClick}
            >
              Yes, withdraw from this deal
            </CTAButton>
          ) : null}

          {/* Cancel CTA */}
          <CTAButton
            fullWidth
            style={
              closeType === DealEndType.EXECUTE
                ? CTAStyle.DARK_OUTLINED
                : closeType === DealEndType.DISSOLVE ||
                  closeType === DealEndType.WITHDRAW
                ? CTAStyle.REGULAR
                : undefined
            }
            onClick={handleCancelAndGoBackClick}
          >
            Cancel and go back
          </CTAButton>
        </div>
      </>
    </Modal>
  );
};

export default DealActionConfirmModal;
