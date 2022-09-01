import NftImageCard from '@/containers/collectives/ClaimPass/NftImageCard';
import NftClaimAndInfoCard from '@/containers/collectives/ClaimPass/NftClaimAndInfoCard';
import CollectivesContainer from '@/containers/collectives/CollectivesContainer';
import { useState, useEffect, useRef } from 'react';
import Modal, { ModalStyle } from '@/components/modal';
import { L2 } from '@/components/typography';

const ClaimPass: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [hasAgreedToTerms, setAgreedToTerms] = useState(false);

  const scrollAgreementRef = useRef<HTMLInputElement>();

  const handleScrolledToBottom = () => {
    setAgreedToTerms(!hasAgreedToTerms);
  };

  const handleDisclaimerClick = () => {
    setShowDisclaimer(false);
  };

  useEffect(() => {
    if (!scrollAgreementRef.current) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollAgreementRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        handleScrolledToBottom();
      }
    };
    scrollAgreementRef?.current?.addEventListener('scroll', onScroll);
    return () =>
      scrollAgreementRef?.current?.removeEventListener('scroll', onScroll);
  }, [scrollAgreementRef.current]);

  return (
    <CollectivesContainer>
      {showDisclaimer ? (
        <Modal
          show={true}
          modalStyle={ModalStyle.DARK}
          showCloseButton={false}
          outsideOnClick={false}
          customClassName="py-8 px-8"
          customWidth="w-full max-w-480"
        >
          <div className="space-y-3">
            <L2>Accessing Syndicate</L2>
            <div
              ref={scrollAgreementRef}
              className="text-base text-gray-syn4 overflow-y-scroll no-scroll-bar h-44"
            >
              By accessing or using Syndicate’s app and its protocol, I agree
              that I will not use Syndicate’s app and its protocol to engage in
              illegal, fraudulent or other wrongful conduct, including but not
              limited to (a) distributing defamatory, obscene or unlawful
              content or content that promotes bigotry, racism, misogyny or
              religious or ethnic hatred, (b) transmitting any information or
              data that infringes any intellectual property rights of any third
              party or that is otherwise libelous, unlawful, or tortious, (c)
              stalking, harassment, or threatening others with violence or
              abuse, or (d) violating any securities laws, anti-money laundering
              laws, anti-terrorist financing laws, anti-bribery or anti-boycott
              laws, or other applicable laws, and to the extent necessary, I
              agree I will seek legal counsel to ensure compliance with
              applicable laws in relevant jurisdictions.
            </div>
            <button
              className={`w-full ${
                !hasAgreedToTerms
                  ? 'primary-CTA-disabled text-gray-lightManatee'
                  : 'primary-CTA transition-all'
              }`}
              onClick={handleDisclaimerClick}
              disabled={!hasAgreedToTerms}
            >
              {!hasAgreedToTerms ? 'Scroll to end' : 'I agree'}
            </button>
          </div>
        </Modal>
      ) : null}

      <div className="flex container mx-auto sm:mt-24 justify-center space-y-6 sm:space-x-32 flex-col sm:flex-row w-full">
        {/* nft image  */}
        <NftImageCard />
        {/* claim and info card  */}
        <NftClaimAndInfoCard />
      </div>
    </CollectivesContainer>
  );
};

export default ClaimPass;
