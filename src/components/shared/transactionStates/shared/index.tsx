import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export enum ModalStyle {
  DARK = 'dark',
  LIGHT = 'light'
}
interface Props {
  show: boolean;
  width?: string;
  modalStyle?: string;
}
/**
 * This is a modal that shows different transaction states
 * @returns an html node in a form of a modal
 */
export const StateModal: React.FC<Props> = (props) => {
  const {
    children,
    show,
    width = 'w-1/3',
    modalStyle = ModalStyle.LIGHT
  } = props;
  const bgColor = `${modalStyle === ModalStyle.LIGHT && 'bg-white'} ${
    modalStyle === ModalStyle.DARK && 'bg-gray-4'
  }`;
  const textColor = `${modalStyle === ModalStyle.LIGHT && 'text-black'} ${
    modalStyle === ModalStyle.DARK && 'text-white'
  }`;

  const childWrapperRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      {show ? (
        <div className="fixed z-100 inset-0 overflow-y-auto mt-6">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0  bg-gray-9 bg-opacity-60"></div>
          </div>
          <div
            className={`flex items-end justify-center ${textColor} min-h-screen sm:pt-4 sm:px-4 pb-20 text-center sm:block sm:p-0`}
          >
            <div
              className={`inline-block align-bottom ${bgColor} rounded-lg sm:my-28 sm:p-6 text-left overflow-hidden shadow-xl transform transition-all max-w-868 ${width}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="mx-4">{children}</div>
            </div>
          </div>
        </div>
      ) : null}

      <Transition.Root show={show} as={Fragment}>
        <Dialog
          initialFocus={childWrapperRef}
          className={`fixed z-50 w-screen h-screen overflow-y-scroll no-scroll-bar justify-center align-middle py-auto inset-0 text-center`}
          onClose={() => null}
          open={show}
        >
          <div
            ref={childWrapperRef}
            className={`flex items-center my-auto justify-center text-center ${textColor} sm:px-4 text-center sm:block sm:p-0`}
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
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
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
                className={`overflow-y-scroll no-scroll-bar md:my-14 align-middle mx-auto inline-block max-h-screen ${
                  bgColor ? bgColor : ''
                } rounded-2xl text-left shadow-xl transform transition-all max-w-868 ${width}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="m-4">{children}</div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default StateModal;
