import Modal, { ModalStyle } from '@/components/modal';
import GradientAvatar from '@/components/syndicates/portfolioAndDiscover/portfolio/GradientAvatar';
import { TransactionCategory } from '@/state/erc20transactions/types';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import React, { ReactNode } from 'react';
import { CategoryPill } from '../../../activity/shared/CategoryPill';
import TokenDetail from '../../collectibles/shared/TokenDetail';

interface ITokenModal {
  showModal: boolean;
  closeModal: () => void;
  tokenDetails: { [x: string]: string };
  isOwner: boolean;
}

const TokenModal: React.FC<ITokenModal> = ({
  showModal,
  closeModal,
  tokenDetails,
  isOwner
}) => {
  const addGrayToDecimalInput = (str: string | number): ReactNode => {
    const [wholeNumber, decimalPart] = str.toString().split('.');
    return (
      <div className="flex">
        {wholeNumber ? <p className="text-white">{wholeNumber}</p> : null}
        {decimalPart ? <p className="text-gray-syn4">.{decimalPart}</p> : null}
      </div>
    );
  };

  const additionalDetails: { [x: string]: string } = {
    'Token name': tokenDetails.tokenName,
    'Club balance': floatedNumberWithCommas(tokenDetails.tokenBalance),
    Value: tokenDetails.value
  };
  return (
    <Modal
      modalStyle={ModalStyle.DARK}
      show={showModal}
      closeModal={(): void => closeModal()}
      customWidth="sm:w-564 w-full"
      customClassName="p-0"
      showCloseButton={false}
      outsideOnClick={true}
      showHeader={false}
      overflow="overflow-x-visible"
      overflowYScroll={false}
      isMaxHeightScreen={false}
    >
      <div>
        <div className="flex rounded-t-2xl items-center flex-col relative py-10 px-5 bg-gray-syn7">
          <div className="mb-8">
            <CategoryPill
              category={TransactionCategory.TOKEN}
              readonly={true}
              isOwner={isOwner}
            />
          </div>
          <div className="flex items-center">
            {tokenDetails.logo ? (
              <img
                alt="token-icon"
                src={tokenDetails.logo}
                className="w-6 h-6"
              />
            ) : (
              <GradientAvatar name={tokenDetails.tokenName} size={'w-6 h-6'} />
            )}
            <div className="inline-flex pl-2 text-xl">
              {tokenDetails.tokenSymbol}
            </div>
          </div>
          <div className="mt-4 text-4.5xl">
            {addGrayToDecimalInput(
              floatedNumberWithCommas(tokenDetails?.tokenBalance)
            )}
          </div>
        </div>
        <div className="flex flex-col p-10 text-base">
          {tokenDetails.description && (
            <div className="mb-10">
              <span>Description</span>
              <p className="mt-4 text-gray-syn4 break-words">
                {tokenDetails.description}
              </p>
            </div>
          )}
          <div>
            <p>Details</p>
            {Object.keys(additionalDetails).map((key, index) => {
              return (
                <div key={index}>
                  <TokenDetail
                    title={key}
                    value={additionalDetails[key]}
                    symbol={tokenDetails.tokenSymbol}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TokenModal;
