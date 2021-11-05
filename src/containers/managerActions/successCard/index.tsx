import React, { useEffect, useState } from "react";
import CopyLink from "@/components/shared/CopyLink";
import Confetti from "react-confetti";

export const SuccessCard: React.FC<{
  syndicateSuccessfullyCreated: boolean;
  clubDepositLink: string;
  updateDepositLinkCopyState: () => void;
  showDepositLinkCopyState: boolean;
}> = ({
  syndicateSuccessfullyCreated,
  clubDepositLink,
  updateDepositLinkCopyState,
  showDepositLinkCopyState,
}) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="w-full -mt-15">
      <Confetti
        width={460}
        height={200}
        style={{
          pointerEvents: "none",
          position: "absolute",
          zIndex: 0,
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          margin: "0 auto",
        }}
        numberOfPieces={showConfetti ? 300 : 0}
        recycle={true}
        onConfettiComplete={(confetti) => {
          setShowConfetti(false);
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
