import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { Callout, CalloutType } from '../callout';
import {
  setCurrentSelectedToken,
  setShowImportTokenModal,
  setShowTokenGateModal
} from '@/state/createInvestmentClub/slice';
import { Token } from '@/types/token';
import Modal, { ModalStyle } from '@/components/modal';
import { AppState } from '@/state';
import { SkeletonLoader } from '../skeletonLoader';

interface IProps {
  showModal: boolean;
  closeModal: () => void;
  handleTokenClick: (token: Token) => void;
}

export const ImportTokenModal: React.FC<IProps> = ({
  showModal,
  closeModal,
  handleTokenClick
}) => {
  const dispatch = useDispatch();

  const {
    createInvestmentClubSliceReducer: {
      currentSelectedToken: { token }
    },
    web3Reducer: {
      web3: {
        activeNetwork: {
          blockExplorer: { baseUrl }
        }
      }
    }
  } = useSelector((state: AppState) => state);

  const handleBack = () => {
    dispatch(setShowImportTokenModal(false));
    dispatch(setCurrentSelectedToken({ token: null }));
  };

  const handleImport = () => {
    handleTokenClick(token);
    dispatch(setShowImportTokenModal(false));
    dispatch(setShowTokenGateModal(false));
    dispatch(setCurrentSelectedToken({ token: null }));
  };

  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={() => closeModal()}
      customWidth="sm:w-564 w-full"
      customClassName="p-0"
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
      alignment="align-top"
      margin="mt-48"
    >
      <div className="flex flex-col pt-8 pb-4 min-h-363 max-h-141 rounded-2xl bg-gray-darkBackground border-6 border-gray-darkBackground focus:outline-none">
        <div className="mb-4 flex flex-col justify-between px-8">
          <div className="flex items-center space-x-4 pb-6">
            <button onClick={handleBack}>
              <ArrowLeftIcon className="w-4" />
            </button>
            <div className="font-whyte text-xl text-white">Import Token</div>
          </div>

          <Callout type={CalloutType.WARNING}>
            <span className="text-sm">
              This token doesn’t appear on the active token lists(s). Make sure
              this is the token that you intend to use for token-gated
              membership.
            </span>
          </Callout>

          <div className="flex flex-col items-center space-y-1 pt-4 pb-10">
            <Image
              src={token?.logoURI || '/images/token-gray-4.svg'}
              alt={token?.name}
              width={40}
              height={40}
            />
            <div className="text-white text-base sm:text-base pt-4">
              <span className="pr-2">
                {token?.name ? (
                  token.name
                ) : (
                  <SkeletonLoader
                    height="5"
                    width="20"
                    borderRadius="rounded-md"
                  />
                )}
              </span>
              <span className="text-gray-3 text-base sm:text-base uppercase">
                {token?.symbol}
              </span>
            </div>
            <a
              href={`${baseUrl}/address/${token?.address}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue"
            >
              {token?.address ? (
                token.address
              ) : (
                <SkeletonLoader
                  height="5"
                  width="82"
                  borderRadius="rounded-md"
                />
              )}
            </a>
            <div className="flex flex-row items-center space-x-1">
              <Image
                src="/images/coingecko.svg"
                alt="CoinGecko"
                width={16}
                height={16}
              />
              <span className="text-gray-syn4 text-sm">
                via CoinGecko token list
              </span>
            </div>
          </div>

          <button
            className="bg-white text-black py-4 w-full rounded-1.5lg"
            onClick={handleImport}
          >
            Import
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const ImportButton: React.FC<{ token: Token }> = ({ token }) => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(setShowImportTokenModal(true));
    dispatch(setCurrentSelectedToken({ token }));
  };

  return (
    <div className="pr-8">
      <button
        className="bg-white rounded-full text-black text-sm px-3.5 py-2"
        onClick={onClick}
      >
        Import
      </button>
    </div>
  );
};
