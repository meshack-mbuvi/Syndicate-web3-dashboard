import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InputFieldWithMax } from "../shared/InputFieldWithMax";
import { setMembersCount } from "@/state/createInvestmentClub/slice";
import MaxButton from "../shared/MaxButton";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { RootState } from "@/redux/store";

import { useSpring, animated } from "react-spring";
import Fade from "@/components/Fade";

const ERROR_MESSAGE = "Between 1 and 99 accepted";
const MAX_MEMBERS_ALLOWED = "99";

const MembersCount: React.FC = () => {
  const {
    createInvestmentClubSliceReducer: { membersCount },
  } = useSelector((state: RootState) => state);

  const [membersNumCount, setMembersNumCount] = useState(membersCount);
  const [memberCountError, setMemberCountError] = useState("");
  const [isInputError, setIsInputError] = useState(false);
  const { setNextBtnDisabled } = useCreateInvestmentClubContext();
  const dispatch = useDispatch();

  const { setShowNextButton, handleNext } = useCreateInvestmentClubContext();

  useEffect(() => {
    if (!membersNumCount) {
      setNextBtnDisabled(true);
      setMemberCountError("");
      setIsInputError(false);
    } else if (
      +membersNumCount > 99 ||
      +membersNumCount < 0 ||
      +membersNumCount === 0
    ) {
      setNextBtnDisabled(true);
      setMemberCountError(ERROR_MESSAGE);
      setIsInputError(true);
    } else {
      setMemberCountError("");
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
    <div className="flex w-full pb-6">
      <InputFieldWithMax
        {...{
          value: parseInt(membersNumCount),
          label: "How many members can join?",
          addOn: <MaxButton handleClick={() => handleSetMax()} />,
          onChange: handleSetMembersCount,
          error: memberCountError,
          hasError: Boolean(isInputError),
          type: "number",
          addSettingDisclaimer: true,
          moreInfo: "You can invite up to 99 members",
        }}
      />
    </div>
  );
};

export default MembersCount;
