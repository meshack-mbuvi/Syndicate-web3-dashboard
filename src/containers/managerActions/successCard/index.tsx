import CopyLink from '@/components/shared/CopyLink';
import { Dispatch, SetStateAction } from 'react';
import Confetti from 'react-confetti';

export const SuccessCard: React.FC<{
  syndicateSuccessfullyCreated: boolean;
  clubDepositLink: string;
  updateDepositLinkCopyState: () => void;
  showDepositLinkCopyState: boolean;
  showConfettiSuccess: boolean;
  setShowConfettiSuccess: Dispatch<SetStateAction<boolean>>;
}> = ({
  syndicateSuccessfullyCreated,
  clubDepositLink,
  updateDepositLinkCopyState,
  showDepositLinkCopyState,
  showConfettiSuccess,
  setShowConfettiSuccess
}) => {
  return (
    <div className="w-full -mt-15">
      <Confetti
        width={460}
        height={200}
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          zIndex: 0,
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          margin: '0 auto'
        }}
        numberOfPieces={showConfettiSuccess ? 1000 : 0}
        recycle={false}
        onConfettiComplete={(confetti) => {
          setShowConfettiSuccess(false);
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          confetti.reset();
        }}
      />
      {/* Add absolute position below to render the confetti behind the copy link component.  */}
      <div className="w-full relative py-16">
        <div className="absolute w-full top-0">
          <CopyLink
            link={clubDepositLink}
            updateCopyState={updateDepositLinkCopyState}
            showCopiedState={showDepositLinkCopyState}
            syndicateSuccessfullyCreated={syndicateSuccessfullyCreated}
          />
        </div>
      </div>
    </div>
  );
};
