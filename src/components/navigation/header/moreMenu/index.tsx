import { Menu, Transition } from "@headlessui/react";


export const MoreMenu: React.FC = () => {

    return (
        <Menu as="div" className="relative">
            {({ open }) => (
                <>
                    <Menu.Button 
                        className={`rounded-full hover:bg-gray-syn7 ${open ? "bg-gray-syn7" : "bg-gray-syn8"} flex-shrink-0 h-10 w-10 relative z-0`}
                    >
                        <img src="/images/ellipsis.svg" className="mx-auto" alt="more" />
                    </Menu.Button>
                    <Transition
                        show={open}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        className="absolute w-0"
                    >
                        <Menu.Items 
                            className={`absolute z-10 top-full bg-black text-left rounded-2xl px-5 py-4 space-y-4 min-w-50 border border-gray-syn7 transition-all duration-500 overflow-hidden mt-2`}
                            style={{transform: "translateX(calc(-100% + 2.375rem))"}}
                        >
                            <div>
                                <a href="https://syndicate.io/" target="_blank" rel="noreferrer" className="block hover:bg-gray-syn8 rounded-sm hover:px-6 hover:-mx-6 hover:py-2 hover:-my-2">About</a>
                            </div>
                            <div>
                                <a href="https://syndicatedao.gitbook.io/syndicate-guide/" target="_blank" rel="noreferrer" className="block hover:bg-gray-syn8 rounded-sm hover:px-6 hover:-mx-6 hover:py-2 hover:-my-2">Guide</a>
                            </div>
                            <div>
                                <a href="https://discord.gg/aB89kn7bvV" target="_blank" rel="noreferrer" className="block hover:bg-gray-syn8 rounded-sm hover:px-6 hover:-mx-6 hover:py-2 hover:-my-2">Discord</a>
                            </div>
                            <div>
                                <a href="https://twitter.com/SyndicateDAO" target="_blank" rel="noreferrer" className="block hover:bg-gray-syn8 rounded-sm hover:px-6 hover:-mx-6 hover:py-2 hover:-my-2">Twitter</a>
                            </div>
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    );
}