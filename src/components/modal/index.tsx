import { useDisableBgScrollOnModal } from '@/hooks/useDisableBgScrollOnModal';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';

interface ModalProps {
  title?: string;
  children: JSX.Element;
  show: boolean;
  closeModal?: () => void;
  type?: string;
  customWidth?: string;
  loading?: boolean | string;
  titleFontSize?: string;
  showCloseButton?: boolean;
  customClassName?: string;
  outsideOnClick?: boolean;
  overflow?: string;
  showBackButton?: boolean;
  closeButtonClassName?: string;
  closeButtonPosition?: string;
  modalStyle?: ModalStyle;
  opacity?: string;
  titleMarginClassName?: string;
  titleAlignment?: string;
  showHeader?: boolean;
  overflowYScroll?: boolean;
  overflowXScroll?: boolean;
  isMaxHeightScreen?: boolean;
  alignment?: string;
  margin?: string;
  maxHeight?: boolean;
  mobileModal?: boolean;
}

export enum ModalStyle {
  DARK = 'dark',
  LIGHT = 'light',
  SUCCESS = 'success'
}

/**
 * Displays a vertically centered modal
 * @param props an object containing the following keys:
 *   - title: an optional string to be displayed on top as header of the modal
 *   - children: an html node serving as the body for the modal
 *   - show: a boolean variable that controls whether to show the modal or not
 *   - closeModal: a function that changes the state of show variable to false
 *   - loading: a boolean value used when the modal is rendering a loading state
 *   - titleFontSize: a string value used to set the font size of the modal title
 *   - showCloseButton: a boolean used to show/hide the modal close button
 *   - type: can be either success or normal. Default is normal
 *   - closeButtonClassName: custom styling for the close button.
 *      - NOTE: A success modal has syndicate logos in the background
 *
 * @returns an html node in a form of a modal
 */
const Modal = (props: ModalProps): JSX.Element => {
  const {
    title,
    children,
    show,
    closeModal,
    customWidth = 'w-11/12 md:w-1/2 lg:w-2/5',
    titleFontSize,
    showCloseButton = true,
    customClassName = 'p-2 sm:p-6',
    closeButtonClassName,
    closeButtonPosition = 'top-9 right-10',
    outsideOnClick,
    titleMarginClassName,
    titleAlignment,
    overflow = 'overflow-hidden',
    showBackButton = false,
    modalStyle = ModalStyle.LIGHT,
    opacity = 'bg-opacity-60',
    showHeader = true,
    overflowYScroll = true,
    overflowXScroll = true,
    isMaxHeightScreen = true,
    alignment = 'align-middle',
    margin = 'md:my-14',
    maxHeight = true,
    mobileModal = false
  } = props;

  const bgColor = `${(modalStyle === ModalStyle.LIGHT && 'bg-white') || ''} ${
    (modalStyle === ModalStyle.DARK && 'bg-gray-syn8') || ''
  } ${(modalStyle === ModalStyle.SUCCESS && 'bg-green-success') || ''}`;

  const textColor = `${
    (modalStyle === ModalStyle.LIGHT && 'text-black') || ''
  } ${(modalStyle === ModalStyle.DARK && 'text-white') || ''}`;

  const modalPosition = mobileModal ? 'items-end' : 'items-center';
  const modalRadius = mobileModal ? 'rounded-t-2xl' : 'rounded-2xl';

  useDisableBgScrollOnModal(show);

  const childWrapperRef = useRef<HTMLDivElement>(null);

  const handleClose = (): void => {
    if (closeModal) {
      closeModal();
    }
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        initialFocus={childWrapperRef}
        className={`fixed z-50 w-screen h-screen overflow-y-scroll no-scroll-bar justify-center align-middle py-auto inset-0 text-center`}
        onClose={(): void => {
          if (outsideOnClick) {
            handleClose();
          }
        }}
        open={show}
      >
        <div
          ref={childWrapperRef}
          className={`flex ${modalPosition} h-screen my-auto justify-center text-center ${textColor} sm:px-4 sm:block sm:p-0`}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={`fixed inset-0 bg-black ${opacity} transition-opacity`}
            />
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
              className={`${
                overflowYScroll ? `overflow-y-scroll` : ``
              } no-scroll-bar ${margin} ${alignment} mx-auto inline-block ${
                isMaxHeightScreen ? 'max-h-screen' : ''
              } ${
                bgColor ? bgColor : ''
              } ${modalRadius} text-left shadow-xl transform transition-all ${
                customWidth || ''
              } ${overflow || ''} ${customClassName || ''}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
              style={{
                maxHeight: `${
                  isMaxHeightScreen ? 'calc(100vh - 100px)' : 'auto'
                }`
              }}
            >
              <div className="hidden sm:block absolute p-4 top-0 left-0">
                {/* back button at the left top of the modal */}
                {showBackButton ? (
                  <button
                    type="button"
                    className="bg-white m-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0"
                    // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
                    onClick={() => closeModal()}
                  >
                    <span className="sr-only">Back</span>
                    <img
                      src="/images/back-chevron-large.svg"
                      className="p-2 opacity-50"
                      alt="back"
                    />
                  </button>
                ) : null}
              </div>

              {/* close button */}
              <div className={`absolute z-10 ${closeButtonPosition}`}>
                {/* close button at the right top of the modal */}
                {showCloseButton ? (
                  <button
                    type="button"
                    className={`text-gray-syn7 ${
                      closeButtonClassName && closeButtonClassName
                    } rounded-md hover:text-gray-syn7 focus:outline-none focus:ring-0`}
                    // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
                    onClick={() => closeModal()}
                  >
                    <span className="sr-only">Close</span>
                    <img
                      src="/images/close-gray-5.svg"
                      width="16"
                      height="16"
                      alt="close"
                    />
                  </button>
                ) : null}
              </div>
              {/* modal title */}
              {title ? (
                <div
                  className={`modal-header ${
                    titleMarginClassName ? titleMarginClassName : 'mb-6 mt-4'
                  }
                  ${textColor} font-whyte ${
                    titleAlignment ? titleAlignment : 'sm:text-center'
                  } leading-8 pl-4 pr-12 sm:pr-0 ${
                    titleFontSize ? `text-modalTitle` : `text-modalSubTitle`
                  }`}
                >
                  {title}
                </div>
              ) : null}
              {/* end of modal title */}

              <div
                className={`${maxHeight && 'max-h-modal'} ${
                  overflowXScroll ? 'overflow-x-scroll' : ''
                } no-scroll-bar ${showHeader ? 'mx-4 align-middle' : ''}`}
              >
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
