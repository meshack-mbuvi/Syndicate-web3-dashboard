import {
  Callout,
  CalloutIconPosition,
  CalloutType
} from '@/components/callout';
import { CTAButton } from '@/components/CTAButton';
import Modal, { ModalStyle } from '@/components/modal';
import { Spinner } from '@/components/shared/spinner';
import { StepsOutline } from '@/components/stepsOutline';
import TransitionBetweenChildren from '@/components/transition/transitionBetweenChildren';
import TransitionInChildren from '@/components/transition/transitionInChildren';
import { B2, B3, B4, H2, H4 } from '@/components/typography';
import { formatInputValueWithCommas } from '@/utils/formattedNumbers';
import DealAccountSwitcher from '../../details/dealAccountSwitcher';

interface Props {
  dealName: string;
  tokenAmount: number;
  tokenLogo: string;
  tokenSymbol: string;
  activeStepIndex: number; // either 0 or 1
  showWaitingOnWalletLoadingState?: boolean;
  handleCreateAllowanceClick: () => void;
  handleRequestAllocationClick: () => void;
}

const DealPrecommitModal: React.FC<Props> = ({
  dealName,
  tokenAmount,
  tokenLogo,
  tokenSymbol,
  activeStepIndex = 0,
  showWaitingOnWalletLoadingState = false,
  handleCreateAllowanceClick,
  handleRequestAllocationClick
}) => {
  return (
    <Modal
      show={true}
      modalStyle={ModalStyle.DARK}
      customClassName="p-8 max-w-112"
      showHeader={false}
    >
      <>
        <B3 extraClasses="text-gray-syn4">Allocate to deal</B3>
        <H2 extraClasses="mb-4.5 mt-1">{dealName} Deal</H2>
        <DealAccountSwitcher
          wallets={[
            {
              address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
              name: 'first.eth',
              avatar: '/images/jazzicon.png'
            },
            {
              address: '0x8410B86f3220631D5110a31f966f12C7A4309435',
              name: 'second.eth',
              avatar: '/images/jazzicon.png'
            }
          ]}
          dealCommitTokenSymbol="USDC"
          walletBalance="27555"
          walletProviderName="MetaMask"
          connectedWallet={{
            address: '0xDFSDF09DGFSS8',
            name: 'alex.eth',
            avatar: '/images/jazzicon.png'
          }}
          handleAccountSwitch={(account) => {
            alert('Switching account to ' + account);
          }}
          disableSwitching={
            activeStepIndex > 0 || showWaitingOnWalletLoadingState
          }
        />
        <StepsOutline
          extraClasses="mt-4.5"
          steps={[
            {
              title: 'Allocation allowance',
              description: (
                <div className="pt-1 space-y-2">
                  <B4>
                    This allowance gives the smart contract access to funds in
                    your wallet and can be voided at any time by you.
                  </B4>
                  <div className="flex items-center px-4 py-3 border border-gray-syn6 rounded-custom">
                    <B3 extraClasses="flex-grow">Allowance</B3>
                    <H4 extraClasses="flex-grow text-white">
                      {formatInputValueWithCommas(String(tokenAmount))}
                    </H4>
                    <div className="flex-grow items-center flex space-x-2">
                      <img src={tokenLogo} alt="Logo" className="w-5 h-5" />
                      <B3 extraClasses="text-white">{tokenSymbol}</B3>
                    </div>
                  </div>
                  <TransitionInChildren
                    isChildVisible={showWaitingOnWalletLoadingState}
                  >
                    <Callout
                      iconPosition={CalloutIconPosition.INLINE}
                      icon={<Spinner height="h-5" width="w-5" margin="" />}
                    >
                      <B2 extraClasses="mb-1">
                        Approve allowance from your wallet
                      </B2>
                      <B4 extraClasses="text-gray-syn3">
                        Before continuing, you need to allow the protocol
                        authorize this amount. You only need to do this once per
                        deal.
                      </B4>
                    </Callout>
                  </TransitionInChildren>
                </div>
              )
            },
            {
              title: 'Request allocation',
              description: (
                <div className="pb-1 space-y-2">
                  <B4>
                    This is only a request and must be accepted before any
                    transfer from your wallet occurs.
                  </B4>
                  <div className="border border-gray-syn6 rounded-custom divide-y">
                    <div className="flex items-center px-4 py-3 border-gray-syn6">
                      <B3 extraClasses="flex-grow">Allowance</B3>
                      <H4 extraClasses="flex-grow text-white">3,000</H4>
                      <div className="flex-grow items-center flex space-x-2">
                        <img src={tokenLogo} alt="Logo" className="w-5 h-5" />
                        <B3 extraClasses="text-white">{tokenSymbol}</B3>
                      </div>
                    </div>
                    <div className="flex items-center px-4 py-3 border-gray-syn6">
                      <B3 extraClasses="flex-grow">Valid until</B3>
                      <div className="h-7 w-2/3">
                        <B3 extraClasses="text-white vertically-center">
                          accepted or withdrawn
                        </B3>
                      </div>
                    </div>
                  </div>
                  <TransitionBetweenChildren
                    visibleChildIndex={showWaitingOnWalletLoadingState ? 1 : 0}
                  >
                    <Callout type={CalloutType.WARNING}>
                      <B3>
                        You may withdraw this request at anytime until it is
                        accepted by the deal maker
                      </B3>
                    </Callout>
                    <Callout
                      iconPosition={CalloutIconPosition.INLINE}
                      icon={<Spinner height="h-5" width="w-5" margin="" />}
                    >
                      <B2 extraClasses="mb-1">
                        Approve allowance from your wallet
                      </B2>
                      <B4 extraClasses="text-gray-syn3">
                        Before continuing, you need to allow the protocol
                        authorize this amount. You only need to do this once
                        deal.
                      </B4>
                    </Callout>
                  </TransitionBetweenChildren>
                </div>
              )
            }
          ]}
          onlyShowActiveDescription={true}
          activeIndex={activeStepIndex}
        />
        <TransitionInChildren isChildVisible={!showWaitingOnWalletLoadingState}>
          <TransitionBetweenChildren visibleChildIndex={activeStepIndex}>
            <CTAButton
              fullWidth
              extraClasses="mt-4.5"
              onClick={handleCreateAllowanceClick}
            >
              Create allowance
            </CTAButton>
            <CTAButton
              fullWidth
              extraClasses="mt-4.5"
              onClick={handleRequestAllocationClick}
            >
              Request allocation
            </CTAButton>
          </TransitionBetweenChildren>
        </TransitionInChildren>
      </>
    </Modal>
  );
};

export default DealPrecommitModal;
