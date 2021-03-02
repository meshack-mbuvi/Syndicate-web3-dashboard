import React from "react";
import CancelButton from "src/components/buttons/buttonWithGreenBg";
import PropTypes from "prop-types";

const Modal = (props) => {
  const { title, children } = props;
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-30"></div>
        </div>

        {/* This element is to trick the browser into centering the modal contents.  */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 text-gray-900 m-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="modal-header mb-4 text-black font-medium text-center leading-8 text-lg">
            {title}
          </div>
          <div>{children}</div>
          <div className="mt-5 sm:mt-6 flex justify-center">
            <CancelButton customClass="px-6 py-1 focus:outline-none focus:ring focus:border-green-300">
              Cancel
            </CancelButton>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
