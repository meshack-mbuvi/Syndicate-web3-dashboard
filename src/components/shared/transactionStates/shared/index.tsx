import React from "react";

interface Props {
  show: boolean;
  children: JSX.Element;
  width?: string;
}
/**
 * This is a modal that shows different transaction states
 * @returns an html node in a form of a modal
 */
export const StateModal = (props: Props) => {
  const { children, show, width = "w-1/3" } = props;

  return (
    <>
      {show ? (
        <div className="fixed z-50 inset-0 overflow-y-auto mt-6">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0  bg-gray-9 opacity-95"></div>
          </div>
          <div className="flex items-end justify-center text-black min-h-screen sm:pt-4 sm:px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className={`inline-block align-bottom bg-white rounded-lg sm:my-28 sm:p-6 text-left overflow-hidden shadow-xl transform transition-all max-w-868 ${width}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline">
              <div className="mx-4">{children}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default StateModal;
