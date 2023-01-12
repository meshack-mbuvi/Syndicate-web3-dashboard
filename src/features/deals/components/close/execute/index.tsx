import {
  Callout,
  CalloutIconPosition,
  CalloutType
} from '@/components/callout';
import { CTAButton, CTAStyle } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import {
  AddressImageSize,
  DisplayAddressWithENS
} from '@/components/shared/ensAddress/display';
import { Spinner } from '@/components/shared/spinner';
import TransitionBetweenChildren from '@/components/transition/transitionBetweenChildren';
import { B2, B3, B4, H2, H4 } from '@/components/typography';
import { formatInputValueWithCommas } from '@/utils/formattedNumbers';
import { DealEndType } from '../types';
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
  tokenLogo?: string;
  tokenSymbol?: string;
  tokenAmount?: string;
  address?: string;
  ensName?: string;
  ensImage?: string;
  closeType?: DealEndType;
  handleDealCloseClick?: () => void;
  transactionFailed?: boolean;
  showWaitingOnExecutionLoadingState?: boolean;
}

const DealCloseModal: React.FC<Props> = ({
  show,
  closeModal,
  outsideOnClick,
  transactionFailed,
  dealName,
  showWaitingOnWalletLoadingState = false,
  destinationAddress,
  destinationEnsName,
  tokenLogo,
  tokenSymbol,
  tokenAmount,
  address,
  ensName,
  ensImage,
  closeType = DealEndType.EXECUTE,
  handleDealCloseClick,
  showWaitingOnExecutionLoadingState
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
        {/* Titles */}
        <B3 extraClasses="text-gray-syn4">
          {closeType === DealEndType.EXECUTE
            ? 'Executing'
            : closeType === DealEndType.DISSOLVE
            ? 'Dissolve'
            : closeType === DealEndType.WITHDRAW
            ? 'Withdrawing from'
            : null}
        </B3>
        <H2 extraClasses="mb-4.5 mt-1">{dealName} Deal</H2>

        {/* Table */}
        <div className="border border-gray-syn6 divide-y rounded-custom mb-4">
          {/* Top row */}
          <div
            className={`px-5 py-4 flex justify-between ${
              closeType === DealEndType.EXECUTE ||
              closeType === DealEndType.DISSOLVE
                ? 'items-center'
                : 'items-start'
            }`}
          >
            <div className="w-1/3">
              {closeType === DealEndType.EXECUTE ? (
                <B3 extraClasses="text-gray-syn3">Transfer</B3>
              ) : closeType === DealEndType.DISSOLVE ? (
                <B3 extraClasses="text-gray-syn3 my-1">Action</B3>
              ) : closeType === DealEndType.WITHDRAW ? (
                <B3 extraClasses="text-gray-syn3 my-1">Amount</B3>
              ) : (
                ''
              )}
            </div>
            {closeType === DealEndType.EXECUTE ? (
              <div className="w-2/3 flex space-x-2 items-center">
                <H4>{formatInputValueWithCommas(String(tokenAmount))}</H4>
                <div className="space-x-1 flex items-center">
                  <img src={tokenLogo} alt="Token" className="w-5 h-5" />
                  <div>{tokenSymbol}</div>
                </div>
              </div>
            ) : closeType === DealEndType.WITHDRAW ? (
              <div className="w-2/3 space-y-1">
                <div className="flex space-x-2 items-center">
                  <H4>{formatInputValueWithCommas(String(tokenAmount))}</H4>
                  <div className="space-x-1 flex items-center">
                    <img src={tokenLogo} alt="Token" className="w-5 h-5" />
                    <div>{tokenSymbol}</div>
                  </div>
                </div>
                <DisplayAddressWithENS
                  address={address}
                  name={ensName}
                  image={ensImage}
                  imageSize={AddressImageSize.SMALLER}
                  customTailwindXSpacingUnit={2}
                  onlyShowOneOfNameOrAddress={true}
                />
              </div>
            ) : (
              <div className="w-2/3">
                <B3>dissolve deal</B3>
              </div>
            )}
          </div>

          {/* Bottom row */}
          <div
            className={`px-5 py-4 flex ${
              closeType === DealEndType.DISSOLVE
                ? 'items-start'
                : 'items-center'
            } justify-between border-gray-syn6`}
          >
            <div className="w-1/3">
              <B3 extraClasses="text-gray-syn3">
                {closeType === DealEndType.EXECUTE ? (
                  <B3>To</B3>
                ) : closeType === DealEndType.DISSOLVE ? (
                  <B3 extraClasses="mt-0.5">Effect</B3>
                ) : closeType === DealEndType.WITHDRAW ? (
                  <B3 extraClasses="my-1">Action</B3>
                ) : (
                  ''
                )}
              </B3>
            </div>
            <div className="w-2/3">
              {closeType === DealEndType.EXECUTE ? (
                <div className="w-2/3">
                  <DisplayAddressWithENS
                    name={destinationEnsName}
                    address={destinationAddress}
                    onlyShowOneOfNameOrAddress={true}
                    truncatedNameMaxWidthClass="max-w-full"
                  />
                </div>
              ) : closeType === DealEndType.WITHDRAW ? (
                <div className="w-2/3">
                  <B3>Withdraw from deal</B3>
                </div>
              ) : (
                <div className="w-2/3">
                  <B3>set all contributions to zero and close deal</B3>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions + warnings */}
        <TransitionBetweenChildren
          visibleChildIndex={
            transactionFailed
              ? 3
              : showWaitingOnExecutionLoadingState
              ? 2
              : showWaitingOnWalletLoadingState
              ? 1
              : closeType === DealEndType.EXECUTE ||
                closeType === DealEndType.DISSOLVE
              ? 0
              : -1
          }
        >
          <div>
            <Callout type={CalloutType.WARNING}>
              <B3>
                {closeType === DealEndType.EXECUTE
                  ? 'Executing this transaction will draw all accepted commitments and transfer them to the target address'
                  : closeType === DealEndType.DISSOLVE
                  ? 'This action is irreversible and will close the deal with no backers accepted.'
                  : ''}
              </B3>
            </Callout>
            <CTAButton
              fullWidth
              extraClasses="mt-4"
              style={
                closeType === DealEndType.EXECUTE
                  ? CTAStyle.REGULAR
                  : closeType === DealEndType.DISSOLVE
                  ? CTAStyle.DARK_OUTLINED
                  : undefined
              }
              onClick={handleDealCloseClick}
            >
              {closeType === DealEndType.EXECUTE
                ? 'Execute deal'
                : closeType === DealEndType.DISSOLVE
                ? 'Dissolve deal'
                : ''}
            </CTAButton>
          </div>

          {/* Waiting on wallet */}
          <Callout
            iconPosition={CalloutIconPosition.INLINE}
            icon={<Spinner height="h-5" width="w-5" margin="" />}
          >
            <B2 extraClasses="mb-1">
              {closeType === DealEndType.EXECUTE
                ? 'Approve deal execution from your wallet'
                : closeType === DealEndType.DISSOLVE
                ? 'Approve dissolution from your wallet'
                : closeType === DealEndType.WITHDRAW
                ? 'Withdraw from deal in your wallet'
                : ''}
            </B2>
            <B4 extraClasses="text-gray-syn3">
              {closeType === DealEndType.EXECUTE
                ? 'You must execute the deal on chain with your wallet'
                : closeType === DealEndType.DISSOLVE
                ? 'You must execute the dissolution of the deal on chain with your wallet'
                : closeType === DealEndType.WITHDRAW
                ? 'You must execute the withdrawal from the deal on chain with your wallet'
                : ''}
            </B4>
          </Callout>

          {/* Execution in progress: we don't have this state in the designs. needs to be added */}
          <Callout
            iconPosition={CalloutIconPosition.INLINE}
            icon={<Spinner height="h-5" width="w-5" margin="" />}
          >
            <B2 extraClasses="mb-1">
              {closeType === DealEndType.DISSOLVE
                ? 'Processing deal dissolution'
                : 'Processing deal execution'}
            </B2>
            <B4 extraClasses="text-gray-syn3">
              This could take up to a few minutes depending on network
              congestion and the gas fees you set. Feel free to leave this
              screen.
            </B4>
          </Callout>

          {/* Execution failed: we don't have this state in the designs. needs to be added */}
          <Callout type={CalloutType.WARNING}>
            <B2 extraClasses="mb-1">
              {closeType === DealEndType.DISSOLVE
                ? 'Deal dissolution failed'
                : 'Deal execution failed'}
            </B2>
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
