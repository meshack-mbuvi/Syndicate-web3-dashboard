import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment, useRef } from "react";

interface ConnectModalProps {
  show: boolean;
  children: JSX.Element;
  closeModal: () => void;
  title?: string;
  subtext?: string;
  showCloseButton?: boolean;
  height?: string;
  type?: string;
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
  } = props;

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
          className="flex items-end justify-center min-h-screen  pt-4 px-4 pb-20 text-center sm:block sm:p-0"
          ref={refDiv}
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
            <Dialog.Overlay className="fixed inset-0 transition-opacity" />
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
              className={`inline-block align-bottom bg-white rounded-2xl px-5 ${
                showCloseButton ? "pt-10" : ""
              } pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:w-96 bg-gray-102 ${
                height ? height : "h-auto"
              }`}
            >
              <button className="h-0 w-0 overflow-hidden" />
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
                  className="text-white text-lg sm:text-xl text-center font-whyte leading-6 font-medium"
                >
                  {title}
                </Dialog.Title>
              ) : null}
              {subtext ? (
                <div className="m-8 mt-2 mb-6">
                  <p className="text-sm text-center font-whyte-light font-bold text-gray-3">
                    {subtext}
                  </p>
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
