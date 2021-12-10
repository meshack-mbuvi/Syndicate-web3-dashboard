import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputFieldWithMax } from "../shared/InputFieldWithMax";
import { setMembersCount } from "@/state/createInvestmentClub/slice";
import MaxButton from "../shared/MaxButton";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { AppState } from "@/state";
import Fade from "@/components/Fade";

const ERROR_MESSAGE = "Between 1 and 99 accepted";
const MEMBER_COUNT_WARNING =
  "Permitting more than 99 members may create significant adverse legal and/or tax consequences. Please consult with an attorney before doing so.";
const MAX_MEMBERS_ALLOWED = "99";

const MembersCount: React.FC = () => {
  const {
    createInvestmentClubSliceReducer: { membersCount },
  } = useSelector((state: AppState) => state);

  const [membersNumCount, setMembersNumCount] = useState(membersCount);
  const [memberCountError, setMemberCountError] = useState("");
  const [memberCountWarning, setMemberCountWarning] = useState<string>("");
  const [isInputError, setIsInputError] = useState(false);
  const { setNextBtnDisabled } = useCreateInvestmentClubContext();
  const dispatch = useDispatch();

  const { setShowNextButton, handleNext } = useCreateInvestmentClubContext();

  useEffect(() => {
    if (!membersNumCount) {
      setNextBtnDisabled(true);
      setMemberCountError("");
      setIsInputError(false);
    } else if (+membersNumCount < 0 || +membersNumCount === 0) {
      setNextBtnDisabled(true);
      setMemberCountError(ERROR_MESSAGE);
      setIsInputError(true);
    } else if (+membersNumCount > 99) {
      setMemberCountWarning(MEMBER_COUNT_WARNING);
    } else {
      setMemberCountError("");
      setMemberCountWarning("");
      setIsInputError(false);
      setNextBtnDisabled(false);
    }
    dispatch(setMembersCount(membersNumCount));
  }, [membersNumCount]);

  const handleSetMax = () => {
    setMembersNumCount(MAX_MEMBERS_ALLOWED);
    setTimeout(() => {
      handleNext();
      setShowNextButton(true);
    }, 400);
  };

  const handleSetMembersCount = (event) => {
    setMembersNumCount(event.target.value);
  };

  return (
    <Fade>
      <div className="flex w-full pb-6">
        <InputFieldWithMax
          {...{
            value: parseInt(membersNumCount.replace(/^0+/, "")),
            label: "How many members can join?",
            addOn: <MaxButton handleClick={() => handleSetMax()} />,
            onChange: handleSetMembersCount,
            error: memberCountError,
            warning: memberCountWarning,
            hasError: Boolean(isInputError),
            type: "number",
            addSettingDisclaimer: true,
            moreInfo: "You can invite up to 99 members",
          }}
        />
      </div>
    </Fade>
  );
};

export default MembersCount;
