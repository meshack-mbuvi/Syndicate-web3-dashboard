import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { Fragment, useRef } from 'react';
import { useDisableBgScrollOnModal } from '@/hooks/useDisableBgScrollOnModal';

interface ConnectModalProps {
  show: boolean;
  children: JSX.Element;
  closeModal: () => void;
  title?: string;
  subtext?: string | React.ReactNode;
  showCloseButton?: boolean;
  height?: string;
  type?: string;
  modalStyle?: ConnectModalStyle;
}

export enum ConnectModalStyle {
  DARK = 'DARK',
  BARE = 'BARE' // transparent + minimal styling
}

export const ConnectModal: React.FC<ConnectModalProps> = (props) => {
  const {
    show,
    closeModal,
    children,
    title,
    subtext,
    showCloseButton = true,
    height,
    modalStyle = ConnectModalStyle.DARK
  } = props;

  useDisableBgScrollOnModal(show);

  const refDiv = useRef(null);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        initialFocus={refDiv}
        as="div"
        static
        className="fixed z-50 inset-0 overflow-y-auto "
        open={show}
        onClose={closeModal}
      >
        <div
          className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
          ref={refDiv}
        >
          <Transition.Child
            as={Fragment}
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-black bg-opacity-60" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`inline-block align-bottom ${
                modalStyle !== ConnectModalStyle.BARE &&
                'bg-white rounded-2xl px-5'
              } ${
                showCloseButton
                  ? `${
                      modalStyle !== ConnectModalStyle.BARE ? 'pt-10' : 'pt-0'
                    }`
                  : ''
              } text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:w-96 ${
                modalStyle !== ConnectModalStyle.BARE && 'pb-4 bg-gray-102'
              } ${height ? height : 'h-auto'}`}
            >
              {modalStyle !== ConnectModalStyle.BARE && (
                <button className="h-0 w-0 overflow-hidden" />
              )}
              {showCloseButton ? (
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md border-0 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue"
                    onClick={() => closeModal()}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              ) : null}
              {title ? (
                <Dialog.Title
                  as="h3"
                  className="text-white text-sm uppercase font-bold tracking-wide px-4.5"
                >
                  {title}
                </Dialog.Title>
              ) : null}
              {subtext ? (
                <div className="mt-2 mb-6 px-4.5 bg-blue-500">
                  <p className="text-xs text-gray-syn5">{subtext}</p>
                </div>
              ) : null}

              <div className="h-full">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
