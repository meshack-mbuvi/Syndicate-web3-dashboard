import { CtaButton } from '@/components/CTAButton';
import CopyLink from '@/components/shared/CopyLink';
import { B2, H3 } from '@/components/typography';
import { useState } from 'react';

interface Props {
  name: string;
  inviteLink: string;
  CTAonClick: (e) => void;
  blockExplorerLink: string;
  blockExplorerName: string;
}

export const CollectivesCreateSuccess: React.FC<Props> = ({
  name,
  inviteLink,
  CTAonClick,
  blockExplorerLink,
  blockExplorerName
}) => {
  const [showCopiedState, setShowCopiedState] = useState(false);
  return (
    <div className="text-center max-w-112">
      <img
        src="/images/checkmark-circle-large.svg"
        alt="Success"
        className="mx-auto mb-10 w-14 h-14"
      />
      <div className="mb-6">
        <H3>Congratulations, {name}</H3>
        <B2 extraClasses="text-gray-syn3">
          A party of one is no fun - It’s time to invite some members
        </B2>
      </div>
      <CopyLink
        link={inviteLink}
        updateCopyState={() => {
          setShowCopiedState(!showCopiedState);
        }}
        showCopiedState={showCopiedState}
        copyButtonText="Copy invite link"
      />
      <CtaButton extraClasses="mt-12 mb-6" onClick={CTAonClick}>
        Manage on dashboard
      </CtaButton>
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
