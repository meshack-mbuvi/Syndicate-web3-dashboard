import Modal, { ModalStyle } from '@/components/modal';
import { E2, H3, M2 } from '@/components/typography';
import { getInputs } from '@/utils/remix';
import { FunctionFragment } from 'ethers/lib/utils';
import Image from 'next/image';

interface SharedAbiFnModalProps {
  showSharedAbiFnModal: boolean;
  handleModalClose: () => void;
  setFnFragment: (fn: FunctionFragment | null) => void;
  moduleName: string;
  showBackButton?: boolean;
  selectedFnFragment?: FunctionFragment | null;
  selectedLookupOnly?: boolean;
  isSyndicateSupported?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

const SharedAbiFnModal: React.FC<SharedAbiFnModalProps> = ({
  showSharedAbiFnModal,
  showBackButton = false,
  handleModalClose,
  setFnFragment,
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
      customClassName={'py-8 px-6'}
    >
      <>
        <div className="flex items-center mb-2">
          {showBackButton && (
            <button className="mr-2" onClick={(): void => setFnFragment(null)}>
              {' '}
              <Image
                src="/images/arrow-left.svg"
                width={16}
                height={13}
                objectFit="contain"
              />{' '}
            </button>
          )}
          <E2 extraClasses="font-normal text-gray-syn3">
            {isSyndicateSupported
              ? `module ${selectedFnFragment ? ' / function' : ''}`
              : 'Custom module'}
          </E2>
        </div>
        <H3 weightClassOverride="font-normal" extraClasses="mb-3">
          {moduleName}
        </H3>
        {selectedFnFragment && (
          <M2 extraClasses="text-gray-syn3 mb-4">
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
