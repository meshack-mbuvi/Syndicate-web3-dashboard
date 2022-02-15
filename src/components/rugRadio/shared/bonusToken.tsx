import { CtaButton } from "@/components/CTAButton";
import { numberWithCommas } from "@/utils/formattedNumbers";
import Image from "next/image";
import React from "react";
import RugRadioTokenWhiteIcon from "/public/images/rugRadio/rugradioToken-white.svg";

type bonusClaimProps = {
  handleClaimBonus;
  bonusAmount: string;
};

export const BonusTokenClaim: React.FC<bonusClaimProps> = ({
  handleClaimBonus,
  bonusAmount = "0",
}) => {
  const disabled = +bonusAmount == 0;
  return (
    <div className="p-8 pt-6 space-y-8 bg-gray-syn8 rounded-2.5xl">
      <div className="space-y-6">
        <p className="h4">Bonus available</p>
        <div className="space-y-4">
          <p className="flex text-xl font-whyte">
            <span className="mr-2 flex">
              <Image
                src={RugRadioTokenWhiteIcon}
                width={16}
                height={16}
                alt="token icon"
              />{" "}
            </span>
            {`${numberWithCommas(bonusAmount)} RUG`}
          </p>

          <p className="small-body text-gray-syn5 leading-5">
            Some of your NFTs have accumulated a bonus yield. You can claim this
            separately.
          </p>
        </div>

        <CtaButton
          onClick={handleClaimBonus}
          greenCta={!disabled}
          disabled={disabled}
        >
          Claim bonus
        </CtaButton>
      </div>
    </div>
  );
};
