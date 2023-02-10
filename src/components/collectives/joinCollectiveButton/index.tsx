import { CTAButton } from '@/components/CTAButton';
import { B4 } from '@/components/typography';
import { useState } from 'react';

interface IProps {
  alreadyMember: boolean;
  onClick: (
    e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
}

export const JoinCollectiveCTA: React.FC<IProps> = (args) => {
  const { alreadyMember, onClick } = args;
  const [showMoreContent, setShowMoreContent] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-88 justify-center h-24">
      <div className="flex w-full transform hover:-translate-y-0.5 hover:scale-104 transition-all duration-500 relative">
        <CTAButton
          fullWidth={true}
          extraClasses={`flex ease-in-out justify-center py-4 border text-base rounded-full leading-5.75`}
          onMouseOver={(): void => setShowMoreContent(true)}
          onMouseOut={(): void => setShowMoreContent(false)}
          onClick={onClick}
          onBlur={(): void => setShowMoreContent(false)}
          onFocus={(): void => setShowMoreContent(true)}
        >
          <div className="flex items-center">
            <span
              className={`transition-all transform duration-500  ${
                showMoreContent ? '-translate-x-3' : ''
              } `}
            >
              {alreadyMember ? 'Claim additional NFT' : 'Join this collective'}
            </span>
            <img
              src={'/images/chevron-right-black.svg'}
              alt={''}
              width={16}
              height={16}
              className={`my-auto transition-all duration-500 ease-in-out ${
                showMoreContent ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          <div
            className={`absolute bottom-0 opacity-0 transition-all duration-500 ease-in-out ${
              showMoreContent ? '-bottom-6 opacity-100' : ''
            } `}
          >
            <B4 extraClasses="text-gray-syn4 mx-auto w-fit-content">
              {alreadyMember ? 'Claim NFT' : 'Claim NFT to join'}
            </B4>
          </div>
        </CTAButton>
      </div>
    </div>
  );
};
