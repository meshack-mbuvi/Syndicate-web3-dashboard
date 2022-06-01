import Modal, { ModalStyle } from '@/components/modal';
import { ShareCard } from '@/components/social';

interface Props {
  isModalVisible: boolean;
  handleModalClose: () => void;
  etherscanURL: string;
  socialURL: string;
}

export const ShareSocialModal: React.FC<Props> = ({
  isModalVisible,
  handleModalClose,
  etherscanURL,
  socialURL
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
          <h3 className="mb-8 text-center">Share the good news</h3>
          <ShareCard
            URL={socialURL}
            imageOptions={[
              'https://media3.giphy.com/media/nV92wySC3iMGhAmR71/giphy.gif',
              'https://media4.giphy.com/media/ZmgSpGW4p8EUspn0Uk/giphy.gif',
              'https://media.giphy.com/media/lMameLIF8voLu8HxWV/giphy.gif'
            ]}
            description="Just made an investment distribution for Alpha Beta Club (✺ABC) on Syndicate 🎉 Check our dashboard for details on how much you will be receiving."
          />
          <button className="primary-CTA w-full mt-8">View on dashboard</button>
          <a
            href={etherscanURL}
            className="text-center flex items-center space-x-2 justify-center w-full block text-blue mt-6 mb-8"
          >
            <div>View on Etherscan</div>
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.5104 2.40005L7.39717 7.51438C7.09707 7.81455 7.09658 8.30259 7.3973 8.60324C7.69728 8.90329 8.18534 8.90402 8.48592 8.60324L13.597 3.4911V5.20081C13.597 5.5863 13.9104 5.90027 14.2969 5.90027C14.6825 5.90027 14.9966 5.58705 14.9966 5.20081V1.69959C14.9966 1.50696 14.9184 1.33215 14.7918 1.20547C14.665 1.07864 14.4904 1.00015 14.2973 1.00015H10.7969C10.4115 1.00015 10.0976 1.31349 10.0976 1.70008C10.0976 2.08595 10.4107 2.40013 10.7969 2.40013L12.5104 2.40005ZM14.9969 9.39999V6.07252V13.2553C14.9969 14.2189 14.3028 15 13.4455 15H2.5514C1.69453 15 1 14.2173 1 13.2553V2.74473C1 1.78112 1.69406 1 2.5514 1H10.0222H6.59892C6.98542 1 7.29882 1.31334 7.29882 1.69993C7.29882 2.08652 6.98542 2.39999 6.59892 2.39999H2.79853C2.57592 2.39999 2.40006 2.60909 2.40006 2.86689V13.133C2.40006 13.3862 2.57848 13.5999 2.79853 13.5999H13.199C13.4216 13.5999 13.5975 13.3908 13.5975 13.133V9.39996C13.5975 9.01337 13.9109 8.6999 14.2974 8.6999C14.6839 8.6999 14.9971 9.01337 14.9971 9.39996L14.9969 9.39999Z"
              />
            </svg>
          </a>
        </div>
      </Modal>
    </>
  );
};
