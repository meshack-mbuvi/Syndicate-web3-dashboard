import { Callout, CalloutType } from '@/components/callout';
import Fade from '@/components/Fade';
import IconLink from '@/components/icons/link';
import IconToken from '@/components/icons/token';
import { B3, B4 } from '@/components/typography';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import { TokenGateOption } from '@/state/createInvestmentClub/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AllowedMembers from './allowedMembers';
import InviteMembers from './inviteMembers';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import useIsPolygon from '@/hooks/collectives/useIsPolygon';
import { setActiveTokenGateOption } from '@/state/createInvestmentClub/slice';
import SegmentedControlAndContent from '@/components/segmentedControl/tabsAndContent';
import { FEATURE_FLAGS } from '@/pages/_app';

const Membership: React.FC<{ className: any }> = ({ className }) => {
  const {
    createInvestmentClubSliceReducer: {
      investmentClubSymbol,
      membershipAddresses,
      errors,
      tokenGateOption,
      tokenRules
    }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const { setNextBtnDisabled, isCreatingInvestmentClub } =
    useCreateInvestmentClubContext();

  const { isReady, isTreatmentOn: isClubMixinGuardTreatmentOn } =
    useFeatureFlag(FEATURE_FLAGS.CLUBS_MIXIN_GUARDED, {
      clubsMixinGuardedAllowlisted: true
    });

  const { isPolygon } = useIsPolygon();

  useEffect(() => {
    if (isCreatingInvestmentClub && isReady && isClubMixinGuardTreatmentOn) {
      const excludeNullRules = tokenRules.filter((token) => token.name);
      if (isPolygon) {
        // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
        setNextBtnDisabled(false);
        dispatch(setActiveTokenGateOption(TokenGateOption.UNRESTRICTED));
      } else if (
        (excludeNullRules.length && !errors.duplicateRules.length) ||
        tokenGateOption === TokenGateOption.UNRESTRICTED
      ) {
        // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
        setNextBtnDisabled(false);
      } else {
        // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
        setNextBtnDisabled(true);
      }
    } else {
      if (
        (isReady && !isClubMixinGuardTreatmentOn) ||
        (membershipAddresses.length && !errors.memberAddresses)
      ) {
        // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
        setNextBtnDisabled(false);
      } else {
        // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
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
            <SegmentedControlAndContent
              activeIndex={activeTab}
              handleTabChange={setActiveTab}
              tabs={[
                {
                  label: 'Non-member'
                },
                {
                  label: 'Member'
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
            </SegmentedControlAndContent>
          </div>
        </div>
        {isReady && isClubMixinGuardTreatmentOn && !isPolygon ? (
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
          <>
            <div className="pt-4 flex">
              {!isPolygon && (
                <div className="flex flex-1 items-center space-x-6 border border-gray-syn6 p-4 pl-6 rounded-md cursor-not-allowed">
                  <IconToken
                    width={28}
                    height={28}
                    extraClasses="flex-shrink-0"
                  />
                  <div className="space-y-0.5">
                    <B3 extraClasses="text-gray-syn5">
                      Owners of certain tokens
                    </B3>
                    <B4 extraClasses="text-gray-syn4">
                      Token-gating coming soon
                    </B4>
                  </div>
                </div>
              )}
              <div className="flex flex-1 items-center space-x-6 border border-blue-neptune p-4 pl-6 rounded-md">
                <IconLink width={28} height={28} extraClasses="flex-shrink-0" />
                <div className="space-y-0.5">
                  <B3>Anyone with the link</B3>
                  <B4 extraClasses="text-gray-syn3">Unrestricted</B4>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Fade>
  );
};

export default Membership;
