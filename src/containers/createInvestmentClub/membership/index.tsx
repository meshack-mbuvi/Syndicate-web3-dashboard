import { Callout, CalloutType } from '@/components/callout';
import Fade from '@/components/Fade';
import PillTabsAndContent from '@/components/pillTabs/tabsAndContent';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AllowedMembers from './allowedMembers';
import InviteMembers from './inviteMembers';
import { TokenGateOption } from '@/state/createInvestmentClub/types';
import useClubMixinGuardFeatureFlag from '@/hooks/clubs/useClubsMixinGuardFeatureFlag';

const Membership: React.FC<{ className }> = ({ className }) => {
  const {
    createInvestmentClubSliceReducer: {
      investmentClubSymbol,
      membershipAddresses,
      errors,
      tokenGateOption,
      tokenRules
    }
  } = useSelector((state: AppState) => state);

  const [activeTab, setActiveTab] = useState(0);
  const { setNextBtnDisabled, isCreatingInvestmentClub } =
    useCreateInvestmentClubContext();
  const { isReady, isClubMixinGuardTreatmentOn } =
    useClubMixinGuardFeatureFlag();

  useEffect(() => {
    if (isCreatingInvestmentClub && isReady && isClubMixinGuardTreatmentOn) {
      const excludeNullRules = tokenRules.filter((token) => token.name);
      if (
        (excludeNullRules.length && !errors.duplicateRules.length) ||
        tokenGateOption === TokenGateOption.UNRESTRICTED
      ) {
        setNextBtnDisabled(false);
      } else {
        setNextBtnDisabled(true);
      }
    } else {
      if (
        (isReady && !isClubMixinGuardTreatmentOn) ||
        (membershipAddresses.length && !errors.memberAddresses)
      ) {
        setNextBtnDisabled(false);
      } else {
        setNextBtnDisabled(true);
      }
    }
  }, [
    membershipAddresses.length,
    isCreatingInvestmentClub,
    tokenGateOption,
    tokenRules,
    errors.duplicateRules,
    JSON.stringify(tokenRules),
    JSON.stringify(errors),
    isClubMixinGuardTreatmentOn
  ]);

  return (
    <Fade>
      <div className={className}>
        <div className="text-xl pb-1">Membership</div>
        <div className="text-gray-syn4 pb-4">
          Ownership of at least 1 ✺{investmentClubSymbol} token grants access to
          data private to the community, such as activity annotations:
        </div>

        <div className="bg-gray-syn9 flex justify-center items-center">
          <div className="pt-5 w-full">
            <PillTabsAndContent
              activeIndex={activeTab}
              handleTabChange={setActiveTab}
              tabs={[
                {
                  name: 'Non-member'
                },
                {
                  name: 'Member'
                }
              ]}
            >
              <div className="flex justify-center">
                <Image
                  width={336}
                  height={248}
                  src="/images/non-member1.png"
                  alt="non-member"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  width={336}
                  height={248}
                  src="/images/member1.png"
                  alt="member"
                />
              </div>
            </PillTabsAndContent>
          </div>
        </div>
        {isReady && isClubMixinGuardTreatmentOn ? (
          <>
            <div className="pt-4 pb-11.5">
              <Callout type={CalloutType.WARNING}>
                This information is still publicly available off-chain, so we do
                not recommend storing sensitive information.
              </Callout>
            </div>
            {isCreatingInvestmentClub ? <AllowedMembers /> : <InviteMembers />}
          </>
        ) : (
          <div className="pt-4 pb-11.5">
            <Callout type={CalloutType.REGULAR}>Coming soon...</Callout>
          </div>
        )}
      </div>
    </Fade>
  );
};

export default Membership;
