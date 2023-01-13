import { Callout, CalloutType } from '@/components/callout';
import { CTAButton } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { AddressImageSize } from '@/components/shared/ensAddress';
import { DisplayAddressWithENS } from '@/components/shared/ensAddress/display';
import { B2, B3, H2, H4 } from '@/components/typography';
import { formatInputValueWithCommas } from '@/utils/formattedNumbers';
import {
  LeftBottomCoinIcon,
  LeftMiddleCoinIcon,
  LeftTopCoinIcon,
  RightBottomCoinIcon,
  RightMiddleCoinIcon,
  RightTopCoinIcon
} from '../../icons/coins';

interface Props {
  dealName: string;
  tokenAmount: number;
  dealTokenSymbol: string;
  depositTokenLogo: string;
  depositTokenSymbol: string;
  walletAddress: string;
  toggleModal: () => void;
  ensName?: string;
}

const DealPrecommitCompleteModal: React.FC<Props> = ({
  dealName,
  tokenAmount,
  dealTokenSymbol,
  depositTokenLogo,
  depositTokenSymbol,
  walletAddress,
  toggleModal,
  ensName = ''
}) => {
  const coinSideWidth = '290px';
  return (
    <Modal
      show={true}
      modalStyle={ModalStyle.TRANSPARENT}
      customClassName="p-0 max-w-112"
      showHeader={false}
      radiusClassName="rounded-none"
      overflow="overflow-visible"
      overflowXScroll={false}
      overflowYScroll={false}
      showCloseButton={false}
      outsideOnClick={true}
      closeModal={toggleModal}
    >
      <div className="space-y-8 relative overflow-visible">
        {/* Flying coins */}
        <div className="bg-opacity-30 h-full w-full animate-fade_in_double">
          <div
            className={`absolute -left-0 -top-0 transform -translate-x-full h-full`}
            style={{
              width: `calc(${coinSideWidth} / 2)`
            }}
          >
            <div className="vertically-center space-y-4 flex flex-col items-center">
              <div className="relative -left-4">
                <div className="relative animate-deal-coin-top-left">
                  <LeftTopCoinIcon />
                </div>
              </div>
              <div className="relative left-4">
                <div className="relative animate-deal-coin-middle-left">
                  <LeftMiddleCoinIcon />
                </div>
              </div>
              <div className="relative -left-4">
                <div className="relative animate-deal-coin-bottom-left">
                  <LeftBottomCoinIcon />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`absolute right-0 -top-0 transform translate-x-full h-full`}
            style={{
              width: `calc(${coinSideWidth} / 2)`
            }}
          >
            <div className="vertically-center space-y-4 flex flex-col items-center">
              <div className="relative left-4">
                <div className="relative animate-deal-coin-top-right">
                  <RightTopCoinIcon />
                </div>
              </div>
              <div className="relative -left-4">
                <div className="relative animate-deal-coin-middle-right">
                  <RightMiddleCoinIcon />
                </div>
              </div>
              <div className="relative left-4">
                <div className="relative animate-deal-coin-bottom-right">
                  <RightBottomCoinIcon />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-syn8 rounded-2.5xl">
          <B3 extraClasses="text-gray-syn4">Your allocation to</B3>
          <H2 extraClasses="mb-4.5 mt-1">{dealName} Deal</H2>

          {/* Table */}
          <div className="divide-y rounded-custom border border-gray-syn6">
            <div className="flex p-5">
              <B3 extraClasses="flex-grow mt-1 text-gray-syn3">Allocate</B3>
              <div className="w-2/3">
                <div className="flex space-x-2 items-center">
                  <H4>{formatInputValueWithCommas(String(tokenAmount))}</H4>
                  <img
                    src={depositTokenLogo || '/images/token-gray-4.svg'}
                    alt="Token"
                    className="w-5 h-5"
                  />
                  <B3>{depositTokenSymbol}</B3>
                </div>
                <DisplayAddressWithENS
                  address={walletAddress}
                  name={ensName}
                  onlyShowOneOfNameOrAddress={true}
                  imageSize={AddressImageSize.SMALL}
                  extraClasses="text-gray-syn4"
                />
              </div>
            </div>
            <div className="flex p-5 items-center border-gray-syn6">
              <B3 extraClasses="flex-grow text-gray-syn3">Valid until</B3>
              <div className="w-2/3 h-6">
                <B3 extraClasses="vertically-center">accepted or withdrawn</B3>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Callout type={CalloutType.WARNING}>
              <B3>
                You may withdraw this request at anytime until it is accepted by
                the deal maker
              </B3>
            </Callout>
          </div>
        </div>
        <div className="p-8 bg-gray-syn8 rounded-2.5xl">
          <B3 extraClasses="text-gray-syn4">If your allocation is accepted</B3>
          <H4 extraClasses="mb-4.5 mt-1">You will receive mirror tokens</H4>

          {/* Table */}
          <div className="divide-y rounded-custom border border-gray-syn6">
            <div className="flex items-center p-5">
              <B3 extraClasses="flex-grow text-gray-syn3">Transfer</B3>
              <div className="w-2/3 flex space-x-2 items-center">
                <img
                  src={depositTokenLogo || '/images/token-gray-4.svg'}
                  alt="Token"
                  className="w-5 h-5"
                />
                <B2>{depositTokenSymbol}</B2>
                <B3 extraClasses="text-gray-syn4">your allocation</B3>
              </div>
            </div>
            <div className="flex p-5 items-center border-gray-syn6">
              <B3 extraClasses="flex-grow text-gray-syn3">Receive</B3>
              <div className="w-2/3 flex space-x-2 items-center">
                {/* TODO [ENG-4762]: verify that logo.svg works sometimes logo looks broken */}
                <img
                  src={'/images/logo.svg' || '/images/token-gray-4.svg'}
                  alt="Token"
                  className="w-5 h-5"
                />
                <B2>{dealTokenSymbol}</B2>
                <B3 extraClasses="text-gray-syn4">deal tokens</B3>
              </div>
            </div>
          </div>
        </div>

        <CTAButton fullWidth onClick={toggleModal}>
          Return to deal page
        </CTAButton>
      </div>
    </Modal>
  );
};

export default DealPrecommitCompleteModal;
