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
                closeType === DealEndType.DISSOLVE
                  ? 'What happens to the backer contributions?'
                  : closeType === DealEndType.WITHDRAW
                  ? 'What happens to my contribution?'
                  : 'What happens to the pre-commits?',
              content:
                closeType === DealEndType.DISSOLVE
                  ? 'When a deal is dissolved all contributions are rejected and the window, if still open, is closed. This will prevent any transfer of funds of any type from occurring. The deal can still be viewed but will be inactive.'
                  : closeType === DealEndType.WITHDRAW
                  ? 'When you withdraw from a deal, you will sign an on-chain event which will prevent any transfer of funds out of your wallet and remove you from the list of backers.'
                  : ''
            },
            {
              title:
                closeType === DealEndType.EXECUTE
                  ? 'What happens to the deal page?'
                  : closeType === DealEndType.DISSOLVE ||
                    closeType === DealEndType.WITHDRAW
                  ? 'Will this go on chain?'
                  : '',
              content:
                closeType === DealEndType.DISSOLVE
                  ? 'This is an on-chain event that you as the deal leader must sign in order to perform. After you sign the deal all information attached to it will remain on-chain.'
                  : closeType === DealEndType.WITHDRAW
                  ? 'This is an on-chain event and will be visible as withdrawal from the deal you have backed once the deal closes.'
                  : ''
            },
            {
              title:
                closeType === DealEndType.EXECUTE
                  ? 'Are participants expecting anything else?'
                  : closeType === DealEndType.DISSOLVE
                  ? 'How do I create a new deal?'
                  : closeType === DealEndType.WITHDRAW
                  ? 'Can I back this deal again later?'
                  : '',
              content:
                closeType === DealEndType.DISSOLVE
                  ? 'In order to create a new deal simply return to the portfolio and select create deal which will enable you to begin the process again.'
                  : closeType === DealEndType.WITHDRAW
                  ? 'You can always back the deal again if you choose to do so as long as the backer window is still open.'
                  : ''
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
