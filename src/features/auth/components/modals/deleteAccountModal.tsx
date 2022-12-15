import { Accordion } from '@/components/accordion';
import { CTAButton, CTAStyle, CTAType } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { H4 } from '@/components/typography';
import React, { useEffect, useState } from 'react';

interface IDeleteAccountModal {
  showModal: boolean;
  closeModal: () => void;
}

const DeleteAccountModal: React.FC<IDeleteAccountModal> = ({
  showModal,
  closeModal
}) => {
  const [disableDelete, setDisableDelete] = useState(true);
  const [visibleDrawerIndex, setVisibleDrawerIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    setTimeout(() => setDisableDelete(false), 10000);
  }, []);

  const handleDelete = (): void => {
    // TODO: [Auth] delete Stych
  };

  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={closeModal}
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
      overflowXScroll={false}
      maxHeight={false}
      customWidth="max-w-120"
      customClassName="p-10"
    >
      <div className="flex flex-col max-w-120">
        <H4 extraClasses="text-center">
          Are you sure you want to delete your Syndicate account?
        </H4>
        <div className="my-8">
          <Accordion
            visibleItemIndex={visibleDrawerIndex}
            handleVisibleItemChange={setVisibleDrawerIndex}
            titleClassName="text-sm tracking-0.1px"
            contentClassName="text-sm"
            items={[
              {
                title: 'What happens to my data?',
                content:
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
              },
              {
                title: 'Does this affect my Investment Clubs and Collectives?',
                content:
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
              },
              {
                title: 'How do I create another account?',
                content:
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
              }
            ]}
          />
        </div>

        <CTAButton
          style={CTAStyle.REGULAR}
          type={disableDelete ? CTAType.DISABLED : CTAType.ERROR}
          extraClasses="py-4"
          onClick={handleDelete}
          disabled={disableDelete}
        >
          {disableDelete ? (
            <Spinner
              color="text-gray-syn4"
              height="h-4"
              width="w-4"
              margin=""
            />
          ) : (
            <span>Yes, delete account</span>
          )}
        </CTAButton>

        <CTAButton
          style={CTAStyle.REGULAR}
          type={CTAType.PRIMARY}
          extraClasses="mt-4 py-4"
          onClick={closeModal}
        >
          Cancel and go back
        </CTAButton>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
