import { useRouter } from 'next/router';
import Image from 'next/image';
import React from 'react';
import { amplitudeLogger, Flow } from '../amplitude';
import {
  CREATE_INVESTMENT_CLUB_CLICK,
  CREATE_COLLECTIVE_CLICK
} from '../amplitude/eventNames';
import { CTAButton } from '../CTAButton';

/**
 * Component to render button that navigates user to the club/DAO creation page
 * @param buttonText
 * @param showIcon
 * Button is displayed on the empty state for the portfolio page as well in the top
 * right corner when there are clubs/DAOs to show.
 */

interface ICreateClubButton {
  creatingClub?: boolean;
  showIcon?: boolean;
}

const CreateClubButton: React.FC<ICreateClubButton> = ({
  creatingClub = true,
  showIcon = true
}) => {
  const router = useRouter();

  return (
    <CTAButton
      extraClasses="flex justify-center items-center w-full sm:w-auto"
      onClick={() => {
        creatingClub
          ? amplitudeLogger(CREATE_INVESTMENT_CLUB_CLICK, {
              flow: Flow.CLUB_CREATE
            })
          : amplitudeLogger(CREATE_COLLECTIVE_CLICK, {
              flow: Flow.COLLECTIVE_CREATE
            });

        creatingClub
          ? router.push(`/clubs/create`)
          : router.push(`/collectives/create`);
      }}
    >
      {showIcon ? (
        <div className="flex items-center">
          <Image src={`/images/add.svg`} height={16} width={16} />
        </div>
      ) : null}
      <p className="ml-3">
        {creatingClub ? 'Create an investment club' : 'Create a collective'}
      </p>
    </CTAButton>
  );
};

export default CreateClubButton;
