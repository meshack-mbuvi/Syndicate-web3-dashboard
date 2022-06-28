import Modal, { ModalStyle } from '@/components/modal';
import { ShareCard } from '@/components/social';
import { BlockExplorerLink } from '@/components/syndicates/shared/BlockExplorerLink';
import { H4 } from '@/components/typography';

interface Props {
  isModalVisible: boolean;
  handleModalClose: () => void;
  transactionHash: string;
  socialURL: string;
  clubName: string;
  clubSymbol: string;
  handleViewDashboard;
}

export const ShareSocialModal: React.FC<Props> = ({
  isModalVisible,
  handleModalClose,
  transactionHash,
  socialURL,
  clubName,
  clubSymbol,
  handleViewDashboard
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
      >
        <div className="m-h-screen px-5">
          <img
            height="64"
            width="64"
            className="m-auto my-10"
            src="/images/checkCircleGreen.svg"
            alt="Success icon"
          />
          <H4 extraClasses="mb-8 text-center">Share the good news</H4>
          <ShareCard
            URL={socialURL}
            imageOptions={[
              'https://media3.giphy.com/media/nV92wySC3iMGhAmR71/giphy.gif',
              'https://media4.giphy.com/media/ZmgSpGW4p8EUspn0Uk/giphy.gif',
              'https://media.giphy.com/media/lMameLIF8voLu8HxWV/giphy.gif'
            ]}
            description={`Just made an investment distribution for ${clubName} (${clubSymbol}) on Syndicate 🎉 Check our dashboard for details on how much you will be receiving.`}
          />
          <button
            className="primary-CTA w-full mt-8"
            onClick={handleViewDashboard}
          >
            View on dashboard
          </button>
          {transactionHash ? (
            <div className="flex justify-center mt-6 mb-8">
              <div className="w-fit-content">
                <BlockExplorerLink
                  resourceId={transactionHash}
                  resource="transaction"
                />
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
};
