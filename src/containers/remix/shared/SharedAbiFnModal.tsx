import Modal, { ModalStyle } from '@/components/modal';
import { E2, H3, M2 } from '@/components/typography';
import { getInputs } from '@/utils/remix';
import { FunctionFragment } from 'ethers/lib/utils';

interface SharedAbiFnModalProps {
  showSharedAbiFnModal: boolean;
  handleModalClose: () => void;
  moduleName: string;
  selectedFnFragment?: FunctionFragment | null;
  selectedLookupOnly?: boolean;
  isSyndicateSupported?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

const SharedAbiFnModal: React.FC<SharedAbiFnModalProps> = ({
  showSharedAbiFnModal,
  handleModalClose,
  moduleName,
  selectedFnFragment,
  selectedLookupOnly,
  isSyndicateSupported = false,
  children
}: SharedAbiFnModalProps) => {
  return (
    <Modal
      show={showSharedAbiFnModal}
      modalStyle={ModalStyle.DARK}
      showCloseButton={false}
      customWidth={'w-full max-w-480'}
      outsideOnClick={true}
      closeModal={handleModalClose}
      customClassName={'p-8'}
    >
      <>
        <div className="flex items-center mb-2 px">
          <E2 extraClasses="font-normal text-gray-syn3">
            {isSyndicateSupported
              ? `module ${selectedFnFragment ? ' / function' : ''}`
              : 'Custom module'}
          </E2>
        </div>
        <H3 extraClasses="font-normal">{moduleName}</H3>
        {selectedFnFragment && (
          <M2 extraClasses="text-gray-syn3 mt-3 mb-4">
            <span className="bg-gray-syn7 pb-1 px-2 text-center rounded">
              {`${selectedLookupOnly ? '[read]' : ''}${
                selectedFnFragment.name
              }: ${getInputs(selectedFnFragment)}`}
            </span>
          </M2>
        )}
        <>{children}</>
      </>
    </Modal>
  );
};

export default SharedAbiFnModal;
