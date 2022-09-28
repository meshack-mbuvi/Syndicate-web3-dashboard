import { EmailSupport } from '@/components/emailSupport';
import Fade from '@/components/Fade';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import { setMembersCount } from '@/state/createInvestmentClub/slice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputFieldWithMax } from '../shared/InputFieldWithMax';
import MaxButton from '../shared/MaxButton';
import { H4 } from '@/components/typography';

const ERROR_MESSAGE = (
  <span>
    Between 1 and 99 accepted to maintain investment club status. Reach out to
    us at <EmailSupport href="hello@syndicate.io" className="text-blue" /> if
    you’re looking to involve more members.
  </span>
);
// const MEMBER_COUNT_WARNING =
//   "Permitting more than 99 members may create significant adverse legal and/or tax consequences. Please consult with an attorney before doing so.";
const MAX_MEMBERS_ALLOWED = '99';

const MembersCount: React.FC<{
  className?: string;
  editButtonClicked?: boolean;
  setInputHasError?: (state: boolean) => void;
}> = ({ editButtonClicked, setInputHasError }) => {
  const {
    createInvestmentClubSliceReducer: { membersCount }
  } = useSelector((state: AppState) => state);

  const [membersNumCount, setMembersNumCount] = useState(membersCount);
  const [memberCountError, setMemberCountError] = useState('');
  const [memberCountWarning, setMemberCountWarning] = useState<string>('');
  const [isInputError, setIsInputError] = useState(false);
  const dispatch = useDispatch();

  const { setNextBtnDisabled, setShowNextButton, handleNext } =
    useCreateInvestmentClubContext();

  useEffect(() => {
    if (setInputHasError) {
      setInputHasError(isInputError);
    }
  }, [isInputError]);

  useEffect(() => {
    if (!membersNumCount) {
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setNextBtnDisabled(true);
      setMemberCountError('');
      setIsInputError(false);
    } else if (+membersNumCount < 0 || +membersNumCount === 0) {
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setNextBtnDisabled(true);
      // @ts-expect-error TS(2345): Argument of type 'Element' is not assignable to pa... Remove this comment to see the full error message
      setMemberCountError(ERROR_MESSAGE);
      setIsInputError(true);
    } else if (+membersNumCount > 99) {
      // Adding hard cap of 99 for launch
      // setMemberCountWarning(MEMBER_COUNT_WARNING);
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setNextBtnDisabled(true);
      // @ts-expect-error TS(2345): Argument of type 'Element' is not assignable to pa... Remove this comment to see the full error message
      setMemberCountError(ERROR_MESSAGE);
      setIsInputError(true);
    } else {
      setMemberCountError('');
      setMemberCountWarning('');
      setIsInputError(false);
      if (editButtonClicked) {
        // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
        setNextBtnDisabled(true);
      } else {
        // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
        setNextBtnDisabled(false);
      }
    }
    membersNumCount
      ? dispatch(setMembersCount(membersNumCount))
      : dispatch(setMembersCount('1'));
  }, [membersNumCount, dispatch, editButtonClicked, setNextBtnDisabled]);

  const handleSetMax = () => {
    setMembersNumCount(MAX_MEMBERS_ALLOWED);
    setTimeout(() => {
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      handleNext();
      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      setShowNextButton(true);
    }, 400);
  };

  const handleSetMembersCount = (event: any) => {
    setMembersNumCount(event.target.value);
  };

  return (
    <Fade>
      <H4 extraClasses="mr-10">What’s the maximum number of members?</H4>
      <div className="flex pb-6">
        <InputFieldWithMax
          value={
            membersNumCount
              ? parseInt(membersNumCount.replace(/^0+/, ''))
              : parseInt('')
          }
          addOn={<MaxButton handleClick={(): void => handleSetMax()} />}
          onChange={handleSetMembersCount}
          error={memberCountError}
          warning={memberCountWarning}
          hasError={Boolean(isInputError)}
          type={'number'}
          addSettingDisclaimer={false}
          moreInfo={
            <div>
              Investment clubs may have up to 99 members{' '}
              <a
                className="cursor-pointer underline"
                href="https://www.sec.gov/reportspubs/investor-publications/investorpubsinvclubhtm.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                according to the SEC.
              </a>{' '}
              Syndicate encourages all users to consult with their own legal and
              tax counsel.
            </div>
          }
        />
      </div>
    </Fade>
  );
};

export default MembersCount;
