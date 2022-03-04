import { Menu, Transition } from "@headlessui/react";
import React from "react";

/**
 * Adds more options component to club members table
 */
const moreOptions: React.FC<{
  moreOptionItems;
  handleMenuItemClick;
}> = ({ moreOptionItems, handleMenuItemClick }) => {
  const handleMenuItemSelect = (e) => {
    // stops click event from opening the member details modal
    e.stopPropagation();
    handleMenuItemClick();
  };
  return (
    <Menu
      as="div"
      className="flex justify-end w-fit-content z-50"
      onClick={(e) => {
        // since there is only one menu item
        // use just e.stopPropagation(); here once more menu items are added.
        handleMenuItemSelect(e);
      }}
    >
      {({ open }) => (
        <>
          <Menu.Button className="relative text-right justify-end flex space-x-2 items-center text-end">
            <img
              src="/images/more_horiz.svg"
              height={16}
              width={16}
              alt="more"
            />
            <span className="ml-2 text-gray-syn5">Member options</span>
          </Menu.Button>
          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            className="relative bg-gray-syn9"
          >
            <Menu.Items
              as="ul"
              className="absolute w-68 right-0 mt-7 z-50 origin-top-right bg-gray-syn7 divide-y divide-gray-9 rounded-1.5lg shadow-lg outline-none px-4 py-5 flex items-center justify-center"
            >
              <button
                onClick={(e) => {
                  handleMenuItemSelect(e);
                }}
              >
                {moreOptionItems}
              </button>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default moreOptions;
