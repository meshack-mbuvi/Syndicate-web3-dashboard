import React, { Dispatch, SetStateAction } from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import { Callout } from '@/components/callout';
import EstimateGas from '@/components/EstimateGas';
import { ContractMapper } from '@/hooks/useGasDetails';

interface IClubStillOpenModal {
  showClubStillOpenModal: boolean;
  setShowClubStillOpenModal: Dispatch<SetStateAction<boolean>>;
  handleCloseClubPostMint: () => void;
}

/** Modal that pops up after a closed club is re-opened for the purpose
 * of adding new members.
 */
export const ClubStillOpenModal: React.FC<IClubStillOpenModal> = ({
  showClubStillOpenModal,
  setShowClubStillOpenModal,
  handleCloseClubPostMint
}) => {
  return (
    <Modal
      {...{
        show: showClubStillOpenModal,
        modalStyle: ModalStyle.DARK,
        showCloseButton: false,
        customWidth: 'w-full max-w-480',
        outsideOnClick: true,
        closeModal: () => {
          localStorage.removeItem('mintingForClosedClub');
          setShowClubStillOpenModal(false);
        },
        customClassName: 'pt-8 pb-6 px-5',
        showHeader: false,
        overflowYScroll: false,
        overflow: 'overflow-visible'
      }}
    >
      <div className="space-y-6">
        <div className="space-y-8">
          <div>
            <div className="pt-0.125 pb-9 w-full flex justify-center">
              <img
                className="h-16 w-16"
                src="/images/syndicateStatusIcons/warning-triangle-yellow.svg"
                alt="exclamation"
              />
            </div>

            <div className="mb-4 text-white w-full text-center">
              <span className="text-md md:text-xl text-white">
                Your club is still open to deposits
              </span>
            </div>

            <div className="space-y-4 text-center">
              <div className="text-gray-syn3">
                You opened your club to deposits so that you could <br /> add a
                new member.
              </div>
              <div className="text-gray-syn3">
                <b className="text-gray-syn3">
                  Would you like to close it to deposits again?
                </b>
              </div>
            </div>
          </div>
          <div className="mx-5 rounded-custom overflow-hidden">
            <Callout extraClasses="p-4 text-sm">
              <EstimateGas
                contract={ContractMapper.MintPolicy}
                customClasses="bg-opacity-30 w-full flex cursor-default items-center"
              />
            </Callout>
            <div className="bg-blue bg-opacity-20 rounded-b-lg">
              <button
                className={`w-full primary-CTA hover:opacity-90 transition-all`}
                type="button"
                onClick={() => handleCloseClubPostMint()}
              >
                Yes, close club to deposits
              </button>
            </div>
          </div>
        </div>
        <div className="w-full text-center">
          <button
            className="text-gray-syn3"
            onClick={() => {
              localStorage.removeItem('mintingForClosedClub');
              setShowClubStillOpenModal(false);
            }}
          >
            No, leave it open to deposits
          </button>
        </div>
      </div>
    </Modal>
  );
};
