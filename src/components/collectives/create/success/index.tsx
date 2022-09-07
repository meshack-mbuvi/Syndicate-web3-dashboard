import { amplitudeLogger, Flow } from '@/components/amplitude';
import { INVITE_LINK_COPY } from '@/components/amplitude/eventNames';
import { CtaButton } from '@/components/CTAButton';
import CopyLink from '@/components/shared/CopyLink';
import { Spinner } from '@/components/shared/spinner';
import { B2, H3 } from '@/components/typography';
import { useState } from 'react';

interface Props {
  name: string;
  inviteLink: string;
  loading: boolean;
  CTAonClick: (e) => void;
  blockExplorerLink: string;
  blockExplorerName: string;
}

export const CollectivesCreateSuccess: React.FC<Props> = ({
  name,
  loading,
  inviteLink,
  CTAonClick,
  blockExplorerLink,
  blockExplorerName
}) => {
  const [showCopiedState, setShowCopiedState] = useState(false);
  return (
    <div className="text-center max-w-112 w-full">
      <img
        src="/images/checkmark-circle-large.svg"
        alt="Success"
        className="mx-auto mb-10 w-14 h-14"
      />
      <div className="mb-6 px-6 md:px-0">
        <H3>Congratulations, {name}</H3>
        <B2 extraClasses="text-gray-syn3">
          A party of one is no fun - It’s time to invite some members
        </B2>
      </div>
      <div className="flex justify-center">
        <div className="max-w-xs sm:max-w-full">
          <CopyLink
            link={inviteLink}
            updateCopyState={() => {
              setShowCopiedState(!showCopiedState);
              amplitudeLogger(INVITE_LINK_COPY, {
                flow: Flow.COLLECTIVE_CREATE
              });
            }}
            showCopiedState={showCopiedState}
            copyButtonText="Copy invite link"
          />
        </div>
      </div>

      {loading ? (
        <div className="w-full flex sm:block justify-center">
          <button className="primary-CTA-disabled mt-12 mb-6 w-full flex items-center justify-center content-center space-x-3 ">
            <span className="">Preparing dashboard</span>
            <Spinner
              margin="my-0 items-center"
              color="text-gray-syn4"
              height="h-4"
              width="w-4"
            />
          </button>
        </div>
      ) : (
        <div className="w-full flex sm:block justify-center">
          <CtaButton
            extraClasses="mt-12 mb-6 px-6 md:px-0"
            onClick={CTAonClick}
          >
            Manage on dashboard
          </CtaButton>
        </div>
      )}
      <a
        href={blockExplorerLink}
        rel="noreferrer"
        target="_blank"
        className="etherscanLink flex space-x-2 items-center justify-center"
      >
        <div>View on {blockExplorerName}</div>
        <img
          src="/images/externalLinkWhite.svg"
          alt="Etherscan"
          className="w-4 h-4"
        />
      </a>
    </div>
  );
};
