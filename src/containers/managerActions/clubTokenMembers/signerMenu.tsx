import { Menu, Transition } from '@headlessui/react';

const Dropdown: React.FC<{
  titleIndex: number;
  menuItems: { menuText: string; menuIcon: any }[];
  // @ts-expect-error TS(7051): Parameter has a name but no type. Did you mean 'ar... Remove this comment to see the full error message
  setSelectedIndex: (number) => void;
}> = (props) => {
  const { titleIndex = 0, menuItems, setSelectedIndex } = props;

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button className="relative justify-between flex space-x-2 items-center">
            <div className="flex items-center">
              {menuItems[titleIndex].menuIcon}
            </div>
            <span>{menuItems[titleIndex].menuText}</span>
            <div className="flex items-center">
              <img src="/images/chevron-down.svg" alt="down-arrow" />
            </div>
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
              className="absolute w-36 right-0 mt-2 origin-top-right bg-gray-syn9 divide-y divide-gray-9 rounded-lg shadow-lg outline-none p-4"
            >
              <div className="space-y-2">
                {menuItems.map((menuItem, index) => (
                  <Menu.Item key={index}>
                    <button
                      className={`flex group space-x-2 py-2 my-auto rounded-md items-center w-full text-sm align-middle`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <span>{menuItem.menuIcon}</span>
                      <span>{menuItem.menuText}</span>
                    </button>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default Dropdown;
