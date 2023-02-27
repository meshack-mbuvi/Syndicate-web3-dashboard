import { useBeforeGettingStartedContext } from '@/context/beforeGettingStartedContext';
import { animated } from 'react-spring';
import { CTAButton, CTAType } from '../CTAButton';
import Modal, { ModalStyle } from '../modal';
import { L2 } from '../typography';

const BeforeGettingStartedModal: React.FC = () => {
  const {
    error,
    showBeforeGettingStarted,
    handleClickOutside,
    handleChange,
    buttonDisabled,
    agreementChecked,
    hideBeforeGettingStarted
  } = useBeforeGettingStartedContext();

  return (
    <>
      {/* @ts-expect-error TS(2322): Type '{ children: Element; show: boolean | undefin... Remove this comment to see the full error message */}
      <Modal
        {...{
          show: showBeforeGettingStarted,
          modalStyle: ModalStyle.DARK,
          showCloseButton: false,
          customWidth: 'w-full max-w-480',
          outsideOnClick: buttonDisabled, // allow outside click only when button is disabled.
          closeModal: () => handleClickOutside?.(),
          customClassName: 'py-8 px-10',
          showHeader: false,
          overflowYScroll: false,
          overflow: 'overflow-visible'
        }}
      >
        <div className="space-y-6">
          <L2>Before getting started</L2>
          <div className="flex items-center space-between pl-1">
            <input
              className={`bg-transparent rounded focus:ring-offset-0 cursor-pointer ${
                error
                  ? 'text-red-error outline-red-error focus:ring-1 focus:ring-red-error border-red-error'
                  : undefined
              }`}
              onChange={(e): void => {
                e.stopPropagation();
                handleChange?.();
              }}
              type="checkbox"
              checked={agreementChecked}
            />
            <animated.p
              className={`text-base text-gray-syn4 ml-4 cursor-pointer select-none leading-6 ${
                error ? 'text-red-error' : ''
              }`}
              onClick={(e): void => {
                e.stopPropagation();
                handleChange?.();
              }}
            >
              I agree to only share this link privately. I understand that
              publicly sharing this link may violate securities laws.{' '}
              <a
                href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html "
                className="text-blue"
                target="_blank"
                rel="noreferrer"
              >
                Learn more.
              </a>
            </animated.p>
          </div>
          <CTAButton
            fullWidth={true}
            type={buttonDisabled ? CTAType.DISABLED : CTAType.TRANSACTIONAL}
            onClick={hideBeforeGettingStarted}
          >
            Get started
          </CTAButton>
        </div>
      </Modal>
    </>
  );
};

export default BeforeGettingStartedModal;
