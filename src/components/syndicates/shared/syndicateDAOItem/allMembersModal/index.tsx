interface AllMembersProps {
  members: { avatar: string; name: string }[];
  hideFullMembersList: Function;
  showAllMembers: boolean;
  name: string;
}

export const AllMembersModal = (props: AllMembersProps) => {
  const { members, hideFullMembersList, showAllMembers, name } = props;

  return (
    <>
      {showAllMembers ? (
        <div className="fixed z-10 inset-0 overflow-y-auto z-100">
          <div className="flex items-end justify-center text-black min-h-screen sm:pt-4 sm:px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0  bg-gray-9 opacity-80"
                onClick={() => hideFullMembersList()}
              ></div>
            </div>

            <div
              className={`inline-block align-bottom bg-gray-4 border border-gray-5 rounded-custom sm:my-28 p-4 px-4 sm:px-8 sm:p-6 text-left overflow-hidden shadow-xl transform transition-all w-full mx-4 sm:max-w-md sm:w-full`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="block absolute p-4 top-0 right-0">
                {/* close button at the right top of the modal */}

                <button
                  type="button"
                  className="hover:text-gray-9 focus:outline-none"
                  onClick={() => hideFullMembersList()}
                >
                  <span className="sr-only">Close</span>
                  <img
                    src="/images/close-white.svg"
                    className="p-2 opacity-100"
                  />
                </button>
              </div>
              {/* modal title */}

              <div
                className={`modal-header mb-6 text-lg leading-6 font-medium text-white font-whyte mb-4`}
              >
                {name}: Members
              </div>
              {/* end of modal title */}
              <div className="mt-2 h-96 overflow-y-auto border-t-1 border-gray-90">
                {members.map((member, index) => {
                  const { avatar, name } = member;
                  return (
                    <div
                      className="flex justify-start mt-4 mb-4 items-center"
                      key={index}
                    >
                      <div
                        style={{
                          background: `url(${avatar}) no-repeat center center`,
                          backgroundSize: "cover",
                          backgroundColor: "#eeeeee"
                        }}
                        className="mr-2 rounded-full w-12 h-12 mr-4 bg-gray-90"
                      ></div>
                      <p className="text-base text-white font-whyte">{name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
