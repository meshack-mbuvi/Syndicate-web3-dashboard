import {
  Callout,
  CalloutIconPosition,
  CalloutType
} from '@/components/callout';
import { CTAButton } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { DisplayAddressWithENS } from '@/components/shared/ensAddress/display';
import { Spinner } from '@/components/shared/spinner';
import TransitionBetweenChildren from '@/components/transition/transitionBetweenChildren';
import { B2, B3, B4, H2, H4 } from '@/components/typography';
import { formatInputValueWithCommas } from '@/utils/formattedNumbers';
import { EmailSupport } from '@/components/emailSupport';

interface Props {
  show: boolean;
  closeModal?: () => void;
  handleExecuteDeal?: () => Promise<void>;
  outsideOnClick?: boolean;
  dealName: string;
  showWaitingOnWalletLoadingState?: boolean;
  destinationAddress?: string;
  destinationEnsName?: string;
  tokenLogo: string;
  tokenSymbol: string;
  tokenAmount: string;
  isExecutingDeal?: boolean;
  transactionFailed?: boolean;
}

const DealCloseModal: React.FC<Props> = ({
  show,
  closeModal,
  outsideOnClick,
  dealName,
  showWaitingOnWalletLoadingState = false,
  destinationAddress,
  destinationEnsName,
  tokenLogo,
  tokenSymbol,
  tokenAmount,
  handleExecuteDeal,
  isExecutingDeal,
  transactionFailed
}) => {
  return (
    <Modal
      show={show}
      modalStyle={ModalStyle.DARK}
      customClassName="p-8 max-w-112"
      showHeader={false}
      closeModal={closeModal}
      outsideOnClick={outsideOnClick}
    >
      <>
        <B3 extraClasses="text-gray-syn4">Executing</B3>
        <H2 extraClasses="mb-4.5 mt-1">{dealName} Deal</H2>
        <div className="border border-gray-syn6 divide-y rounded-custom mb-4">
          <div className="px-5 py-4 flex justify-between items-center">
            <div className="w-1/3">
              <B3 extraClasses="text-gray-syn3">Transfer</B3>
            </div>
            <div className="w-2/3 flex space-x-2 items-center">
              <H4>{formatInputValueWithCommas(String(tokenAmount))}</H4>
              <div className="space-x-1 flex items-center">
                <img src={tokenLogo} alt="Token" className="w-5 h-5" />
                <div>{tokenSymbol}</div>
              </div>
            </div>
          </div>
          <div className="px-5 py-4 flex items-center justify-between border-gray-syn6">
            <div className="w-1/3">
              <B3 extraClasses="text-gray-syn3">To</B3>
            </div>
            <div className="w-2/3">
              <DisplayAddressWithENS
                name={destinationEnsName}
                address={destinationAddress}
                onlyShowOneOfNameOrAddress={true}
                truncatedNameMaxWidthClass="max-w-full"
              />
            </div>
          </div>
        </div>
        <TransitionBetweenChildren
          visibleChildIndex={
            transactionFailed
              ? 3
              : isExecutingDeal
              ? 2
              : showWaitingOnWalletLoadingState
              ? 1
              : 0
          }
        >
          <div>
            <Callout type={CalloutType.WARNING}>
              <B3>
                Executing this transaction will draw all accepted commitments
                and transfer them to the target address
              </B3>
            </Callout>
            <CTAButton
              fullWidth
              extraClasses="mt-4"
              onClick={handleExecuteDeal}
            >
              Execute deal
            </CTAButton>
          </div>
          <Callout
            iconPosition={CalloutIconPosition.INLINE}
            icon={<Spinner height="h-5" width="w-5" margin="" />}
          >
            <B2 extraClasses="mb-1">Approve deal execution from your wallet</B2>
            <B4 extraClasses="text-gray-syn3">
              You must execute the deal on chain with your wallet
            </B4>
          </Callout>

          {/* Execution in progress: we don't have this state in the designs. needs to be added */}
          <Callout
            iconPosition={CalloutIconPosition.INLINE}
            icon={<Spinner height="h-5" width="w-5" margin="" />}
          >
            <B2 extraClasses="mb-1">Executing your deal</B2>
            <B4 extraClasses="text-gray-syn3">
              This could take up to a few minutes depending on network
              congestion and the gas fees you set. Feel free to leave this
              screen.
            </B4>
          </Callout>
          {/* Execution failed: we don't have this state in the designs. needs to be added */}
          <Callout type={CalloutType.WARNING}>
            <B2 extraClasses="mb-1">Deal execution failed</B2>
            <B4 extraClasses="text-gray-syn3">
              <span>
                Please try again and
                <EmailSupport
                  linkText="let us know"
                  className="text-blue focus:outline-none mx-1"
                />
                if the issue persists.
              </span>
            </B4>
          </Callout>
        </TransitionBetweenChildren>
      </>
    </Modal>
  );
};

export default DealCloseModal;
