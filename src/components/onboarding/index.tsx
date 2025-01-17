import { useOnboardingContext } from '@/context/OnboardingContext';
import { CTAButton } from '../CTAButton';
import Modal, { ModalStyle } from '../modal';
import { H4 } from '../typography';

const OnboardingModal: React.FC = () => {
  const { showInvestorOnboarding, hideInvestorOnboarding } =
    useOnboardingContext();

  return (
    <Modal
      title="Welcome to the future of investing"
      // @ts-expect-error TS(2322): Type 'boolean | undefined' is not assignable to ty... Remove this comment to see the full error message
      show={showInvestorOnboarding}
      closeModal={hideInvestorOnboarding}
      modalStyle={ModalStyle.DARK}
    >
      <>
        <p className="mb-6 text-gray-2 font-whyte-light">
          Syndicate gives you more than any other investing tool, as
          Syndicate&apos;s smart contracts automate a wide range of functions,
          including:
        </p>

        <div className="border-t border-b border-gray-24 fade-b-dark-modal">
          <div className="overflow-scroll no-scroll-bar py-6 max-h-60 sm:max-h-72">
            <div className="grid sm:grid-rows-4 sm:grid-cols-2 sm:gap-6 h-full">
              <div className="mb-6 sm:mb-0">
                <H4>Crypto-native bank account</H4>
                <p className="text-gray-2 font-whyte-light">
                  Start investing in seconds—no need to work with a bank
                </p>
              </div>

              <div className="mb-6 sm:mb-0">
                <H4>DAOs with legal entities</H4>
                <p className="text-gray-2 font-whyte-light">
                  Make real world investments and protect your members
                </p>
              </div>

              <div className="mb-6 sm:mb-0">
                <H4>Cap table management</H4>
                <p className="text-gray-2 font-whyte-light">
                  View and easily manage your investor cap table
                </p>
              </div>

              <div className="mb-6 sm:mb-0">
                <H4>Real-time reporting</H4>
                <p className="text-gray-2 font-whyte-light">
                  Easily view real-time fund activity and performance
                </p>
              </div>

              <div className="mb-6 sm:mb-0">
                <H4>Deposits management</H4>
                <p className="text-gray-2 font-whyte-light">
                  Easily deposit and raise capital in just a few clicks
                </p>
              </div>

              <div className="mb-6 sm:mb-0">
                <H4>Distributions management</H4>
                <p className="text-gray-2 font-whyte-light">
                  Easily distribute and collect returns in just a few clicks
                </p>
              </div>

              <div className="mb-6 sm:mb-0">
                <H4>Tax reports</H4>
                <p className="text-gray-2 font-whyte-light">
                  Easily generate reports to meet tax requirements
                </p>
              </div>

              <div>
                <H4>Social investing</H4>
                <p className="text-gray-2 font-whyte-light">
                  Build your investment portfolio and co-invest with others
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center font-whyte-light">
          and more coming soon...
        </p>
        <CTAButton
          fullWidth={true}
          extraClasses={`mt-6 mb-4`}
          onClick={hideInvestorOnboarding}
        >
          Get started
        </CTAButton>
      </>
    </Modal>
  );
};

export default OnboardingModal;
