import { useRouter } from 'next/router';
import Image from 'next/image';
import React from 'react';
// import { amplitudeLogger, Flow } from '../amplitude';
// import { CREATE_INVESTMENT_CLUB_CLICK } from '../amplitude/eventNames';
import { CTAButton } from '../CTAButton';

/**
 * Component to render button that navigates user to the Deal creation page
 * @param showIcon
 * Button is displayed on the empty state for the portfolio page as well in the top
 * right corner when there are clubs/DAOs to show.
 */

interface ICreateDealButton {
  showIcon?: boolean;
}

const CreateDealButton: React.FC<ICreateDealButton> = ({ showIcon = true }) => {
  const router = useRouter();

  return (
    <CTAButton
      extraClasses="flex justify-center items-center w-full sm:w-auto"
      onClick={(): void => {
        // TODO [ENG-4866]: Add create deal click event

        // void amplitudeLogger(CREATE_INVESTMENT_CLUB_CLICK, {
        //   flow: Flow.CLUB_CREATE
        // });

        void router.push(`/deals/create`);
      }}
    >
      {showIcon ? (
        <div className="flex items-center">
          <Image src="/images/add.svg" height={16} width={16} />
        </div>
      ) : null}
      <p className="ml-3">Propose a Deal</p>
    </CTAButton>
  );
};

export default CreateDealButton;
