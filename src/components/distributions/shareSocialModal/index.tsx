/* eslint-disable @next/next/no-html-link-for-pages */
import { CTAButton } from '@/components/CTAButton';
import { ExternalLinkColor } from '@/components/iconWrappers';
import Modal, { ModalStyle } from '@/components/modal';
import { ShareCard } from '@/components/social';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { H4 } from '@/components/typography';

interface Props {
  isModalVisible: boolean;
  handleModalClose: () => void;
  transactionHash: string;
  title?: string;
  socialURL: string;
  description: string;
  handleClick: any;
  buttonLabel: string | any;
  imageOptions?: string[];
  customVisual?: any;
}

export const ShareSocialModal: React.FC<Props> = ({
  isModalVisible,
  handleModalClose,
  transactionHash,
  title = 'Share the good news',
  socialURL,
  description,
  handleClick,
  buttonLabel,
  imageOptions = [
    'https://media3.giphy.com/media/nV92wySC3iMGhAmR71/giphy.gif',
    'https://media4.giphy.com/media/ZmgSpGW4p8EUspn0Uk/giphy.gif',
    'https://media.giphy.com/media/lMameLIF8voLu8HxWV/giphy.gif'
  ],
  customVisual
}) => {
  return (
    <>
      <Modal
        show={isModalVisible}
        closeModal={handleModalClose}
        showCloseButton={false}
        modalStyle={ModalStyle.DARK}
        customWidth=""
        customClassName=""
        showHeader={false}
        outsideOnClick={true}
      >
        <div className="m-h-screen px-5">
          <img
            height="64"
            width="64"
            className="m-auto my-10"
            src="/images/checkCircleGreen.svg"
            alt="Success icon"
          />
          <H4 extraClasses="mb-8 text-center">{title}</H4>
          <ShareCard
            URL={socialURL}
            imageOptions={imageOptions}
            customVisual={customVisual}
            description={description}
          />
          <CTAButton
            fullWidth={true}
            extraClasses={`mt-8 ${!transactionHash ? 'mb-6' : ''}`}
            onClick={handleClick}
          >
            {buttonLabel}
          </CTAButton>
          {transactionHash ? (
            <div>
              <div className="flex justify-center mt-6 mb-3">
                <div>
                  <BlockExplorerLink
                    resourceId={transactionHash}
                    resource="transaction"
                    iconcolor={ExternalLinkColor.WHITE}
                  />
                </div>
              </div>
              <div className="flex justify-center mb-6">
                <a
                  href="/collectives/create"
                  target="_blank"
                  className="text-orange-utopia"
                >
                  Launch your Collective →
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
};
