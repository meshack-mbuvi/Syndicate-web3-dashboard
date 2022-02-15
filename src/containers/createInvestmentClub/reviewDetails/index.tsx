import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { AppState } from "@/state";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { animated, useTransition } from "react-spring";
import AmountToRaise from "../amountToRaise";
import ClubNameSelector from "../clubNameSelector";
import MembersCount from "../membersCount";
import MintMaxDate from "../mintMaxDate";

const ReviewDetails: React.FC = () => {
  const {
    investmentClubName,
    investmentClubSymbol,
    membersCount,
    mintEndTime,
    tokenCap,
    tokenDetails: { depositTokenSymbol, depositTokenLogo },
  } = useSelector((state: AppState) => state.createInvestmentClubSliceReducer);

  const { currentStep, setBackBtnDisabled, setNextBtnDisabled } =
    useCreateInvestmentClubContext();

  const [inlineEditView, setInlineEditView] = useState<string>("");
  const [editClubNameSelector, setEditClubNameSelector] =
    useState<boolean>(false);
  const [editAmountToRaise, setEditAmountToRaise] = useState<boolean>(false);
  const [editMintMaxDate, setEditMintMaxDate] = useState<boolean>(false);
  const [editMembersCount, setEditMembersCount] = useState<boolean>(false);
  const [memberCountHasError, setMemberCountHasError] = useState(false);
  const [agreementFirstChecked, setAgreementFirstChecked] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      editClubNameSelector ||
      editAmountToRaise ||
      editMintMaxDate ||
      editMembersCount
    ) {
      setBackBtnDisabled(true);
    } else {
      setBackBtnDisabled(false);
    }
  }, [
    editClubNameSelector,
    editAmountToRaise,
    editMintMaxDate,
    editMembersCount,
    setBackBtnDisabled,
  ]);

  useEffect(() => {
    if (
      editClubNameSelector ||
      editAmountToRaise ||
      editMintMaxDate ||
      editMembersCount
    ) {
      setNextBtnDisabled(true);
    } else if (currentStep >= 4 && !agreementFirstChecked) {
      setNextBtnDisabled(true);
    } else {
      setNextBtnDisabled(false);
    }

    // temporary solution for edge case of Back button and then review again
    if (currentStep < 4) {
      setAgreementFirstChecked(false);
    }
  }, [
    editClubNameSelector,
    editAmountToRaise,
    editMintMaxDate,
    editMembersCount,
    currentStep,
    setNextBtnDisabled,
    agreementFirstChecked,
  ]);

  const showInvestmentName = investmentClubName && currentStep >= 1;
  const showTokenCap = tokenCap && currentStep >= 2;
  const showMintDate = mintEndTime && currentStep >= 3;
  const showMemberCount = membersCount && currentStep >= 4;

  const headerTransitionStyles = {
    from: { opacity: 1, fontSize: "20px", color: "#ffffff", y: 40 },
    enter: { opacity: 1, fontSize: "14px", color: "#90949E", y: 0 },
    config: { duration: 200 },
  };

  const sectionTransitionStyles = {
    from: { y: 40 },
    enter: { y: 0 },
    delay: 400,
  };

  const investmentClubHeaderTransition = useTransition(showInvestmentName, {
    ...headerTransitionStyles,
  });

  const investmentClubTransition = useTransition(showInvestmentName, {
    ...sectionTransitionStyles,
  });

  const tokenCapHeaderTransition = useTransition(showTokenCap, {
    ...headerTransitionStyles,
  });

  const tokenCapTransition = useTransition(showTokenCap, {
    ...sectionTransitionStyles,
  });

  const mindEndTimeHeaderTransition = useTransition(showMintDate, {
    ...headerTransitionStyles,
  });

  const mindEndTimeTransition = useTransition(showMintDate, {
    ...sectionTransitionStyles,
  });

  const memberCountHeaderTransition = useTransition(showMemberCount, {
    ...headerTransitionStyles,
  });

  const memberCountTransition = useTransition(showMemberCount, {
    ...sectionTransitionStyles,
  });

  const usdcTransition = useTransition(showTokenCap, {
    from: { x: 150 },
    enter: { x: 0 },
    config: { duration: 400 },
    delay: 100,
  });

  return (
    <>
      <div className="w-full mb-8 sm:mb-16">
        {editClubNameSelector ? (
          <animated.div className="relative w-full mb-2 pt-2 pb-2">
            <ClubNameSelector editButtonClicked={editClubNameSelector} />
            {investmentClubName ? (
              <animated.div
                className="flex items-center absolute top-3 right-5"
                onClick={() => setEditClubNameSelector(!editClubNameSelector)}
                style={{ color: "#4376FF", cursor: "pointer" }}
              >
                {"Save"}
              </animated.div>
            ) : null}
          </animated.div>
        ) : (
          investmentClubTransition((styles, item) =>
            item ? (
              <animated.div
                className="flex justify-between px-5 py-4"
                style={
                  inlineEditView === "investmentClub"
                    ? {
                        backgroundColor: "#131416",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }
                    : { display: "inherit" }
                }
                onMouseEnter={() => setInlineEditView("investmentClub")}
                onMouseLeave={() => setInlineEditView("")}
              >
                <animated.div style={styles}>
                  {editClubNameSelector ? (
                    <ClubNameSelector className="flex flex-col pb-6 w-full lg:w-full" />
                  ) : (
                    <div>
                      {investmentClubHeaderTransition((styles, item) =>
                        item ? (
                          <animated.p
                            style={styles}
                            className="text-sm text-gray-syn4"
                          >
                            What should we call this investment club?
                          </animated.p>
                        ) : null,
                      )}
                      <div className="flex mt-2 text-base">
                        <p className="text-white">{investmentClubName}</p>
                        <p className="ml-4 text-gray-syn4">
                          Club token ✺{investmentClubSymbol}
                        </p>
                      </div>
                    </div>
                  )}
                </animated.div>
                {inlineEditView === "investmentClub" ? (
                  <animated.div
                    className="flex items-center"
                    onClick={() =>
                      setEditClubNameSelector(!editClubNameSelector)
                    }
                    style={{ color: "#4376FF", cursor: "pointer" }}
                  >
                    {"Edit"}
                  </animated.div>
                ) : null}
              </animated.div>
            ) : null,
          )
        )}

        {editAmountToRaise ? (
          <animated.div className="relative w-full mt-4 mb-2 pl-5 pr-5 pt-2 pb-2">
            <div className="-ml-5">
              <AmountToRaise editButtonClicked={editAmountToRaise} />
            </div>

            <animated.div
              className="flex items-center absolute top-3 right-5"
              onClick={() => setEditAmountToRaise(!editAmountToRaise)}
              style={{ color: "#4376FF", cursor: "pointer" }}
            >
              {"Save"}
            </animated.div>
          </animated.div>
        ) : (
          tokenCapTransition((styles, item) =>
            item ? (
              <animated.div
                className="flex justify-between px-5 py-4"
                style={
                  inlineEditView === "tokenCap"
                    ? {
                        backgroundColor: "#131416",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }
                    : { display: "inherit" }
                }
                onMouseEnter={() => setInlineEditView("tokenCap")}
                onMouseLeave={() => setInlineEditView("")}
              >
                <animated.div style={styles}>
                  {editAmountToRaise ? (
                    <div className="-ml-5">
                      <AmountToRaise className="w-full lg:w-full" />
                    </div>
                  ) : (
                    <div>
                      {tokenCapHeaderTransition((styles, item) =>
                        item ? (
                          <animated.p style={styles}>
                            What’s the upper limit of the club’s raise?
                          </animated.p>
                        ) : null,
                      )}
                      <div className="flex mt-2 text-base">
                        <p className="text-white">
                          {floatedNumberWithCommas(tokenCap)}
                        </p>
                        {usdcTransition((styles, item) =>
                          item ? (
                            <animated.div
                              style={styles}
                              className="ml-4 text-gray-syn4 flex"
                            >
                              <Image
                                src={depositTokenLogo}
                                height={24}
                                width={24}
                              />
                              <p className="ml-2 text-base">
                                {depositTokenSymbol}
                              </p>
                            </animated.div>
                          ) : null,
                        )}
                      </div>
                    </div>
                  )}
                </animated.div>
                {inlineEditView === "tokenCap" ? (
                  <animated.div
                    className="flex items-center"
                    onClick={() => setEditAmountToRaise(!editAmountToRaise)}
                    style={{ color: "#4376FF", cursor: "pointer" }}
                  >
                    {"Edit"}
                  </animated.div>
                ) : null}
              </animated.div>
            ) : null,
          )
        )}

        {editMintMaxDate ? (
          <animated.div className="relative w-full my-2 px-5 pt-2 pb-2">
            <div className="-ml-5">
              <MintMaxDate />
            </div>
            <animated.div
              className="flex items-center absolute top-3 right-5"
              onClick={() => setEditMintMaxDate(!editMintMaxDate)}
              style={{ color: "#4376FF", cursor: "pointer" }}
            >
              {"Save"}
            </animated.div>
          </animated.div>
        ) : (
          mindEndTimeTransition((styles, item) =>
            item ? (
              <animated.div
                className="flex justify-between px-5 py-4"
                style={
                  inlineEditView === "mindEnd"
                    ? {
                        backgroundColor: "#131416",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }
                    : { display: "inherit" }
                }
                onMouseEnter={() => setInlineEditView("mindEnd")}
                onMouseLeave={() => setInlineEditView("")}
              >
                <animated.div style={styles}>
                  {editMintMaxDate ? (
                    <div className="-ml-5">
                      <MintMaxDate className="w-full lg:w-full" />
                    </div>
                  ) : (
                    <div>
                      {mindEndTimeHeaderTransition((styles, item) =>
                        item ? (
                          <animated.p
                            style={styles}
                            className="text-sm text-gray-syn4"
                          >
                            When will deposits close?
                          </animated.p>
                        ) : null,
                      )}
                      <div className="flex mt-2 text-base">
                        {!mintEndTime?.mintTime ||
                        mintEndTime?.mintTime === "Custom" ? (
                          <></>
                        ) : (
                          <p className="text-white mr-4">
                            {mintEndTime?.mintTime}
                          </p>
                        )}
                        <p className="text-white">
                          {format(
                            new Date(
                              mintEndTime?.value
                                ? mintEndTime?.value * 1000
                                : new Date(),
                            ),
                            "MMM dd, yyyy, hh:mm b",
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </animated.div>
                {inlineEditView === "mindEnd" ? (
                  <animated.div
                    className="flex items-center"
                    onClick={() => setEditMintMaxDate(!editMintMaxDate)}
                    style={{ color: "#4376FF", cursor: "pointer" }}
                  >
                    {"Edit"}
                  </animated.div>
                ) : null}
              </animated.div>
            ) : null,
          )
        )}

        {editMembersCount ? (
          <animated.div className="relative w-full py-2 px-5">
            <div className="-ml-5">
              <MembersCount
                editButtonClicked={editMembersCount}
                className="w-full lg:w-full"
                setInputHasError={setMemberCountHasError}
              />
            </div>
            {!memberCountHasError ? (
              <animated.div
                className="flex items-center absolute top-3 right-5"
                onClick={() => setEditMembersCount(!editMembersCount)}
                style={{ color: "#4376FF", cursor: "pointer" }}
              >
                {"Save"}
              </animated.div>
            ) : null}
          </animated.div>
        ) : (
          memberCountTransition((styles, item) =>
            item ? (
              <animated.div
                className="flex justify-between px-5 py-4"
                style={
                  inlineEditView === "memberCount"
                    ? {
                        backgroundColor: "#131416",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }
                    : { display: "inherit" }
                }
                onMouseEnter={() => setInlineEditView("memberCount")}
                onMouseLeave={() => setInlineEditView("")}
              >
                <animated.div style={styles}>
                  {editMembersCount ? (
                    <div className="-ml-5">
                      <MembersCount />
                    </div>
                  ) : (
                    <div>
                      {memberCountHeaderTransition((styles, item) =>
                        item ? (
                          <animated.p
                            style={styles}
                            className="text-sm text-gray-syn4"
                          >
                            What’s the maximum number of members?
                          </animated.p>
                        ) : null,
                      )}
                      <div className="flex mt-2 text-base">
                        <p className="text-white">{membersCount}</p>
                      </div>
                    </div>
                  )}
                </animated.div>
                {inlineEditView === "memberCount" ? (
                  <animated.div
                    className="flex items-center"
                    onClick={() => setEditMembersCount(!editMembersCount)}
                    style={{ color: "#4376FF", cursor: "pointer" }}
                  >
                    {"Edit"}
                  </animated.div>
                ) : null}
              </animated.div>
            ) : null,
          )
        )}
      </div>
      {currentStep >= 4 && (
        <div className="w-full mb-36 ml-5">
          <div className="flex items-center space-between px-5 mb-5 -ml-5">
            <input
              className="self-start bg-transparent rounded focus:ring-offset-0 cursor-pointer"
              onChange={() => setAgreementFirstChecked(!agreementFirstChecked)}
              type="checkbox"
              id="agreementFirst"
              name="agreementFirst"
              checked={agreementFirstChecked}
            />
            <animated.div
              className="text-xs text-gray-syn4 leading-4.5 pl-4 cursor-pointer select-none"
              onClick={() => setAgreementFirstChecked(!agreementFirstChecked)}
            >
              <div>
                By accessing or using Syndicate’s app and its protocol, I agree
                that:
              </div>

              <ul className="list-disc list-outside ml-0 pl-6">
                <li>
                  I will not violate securities laws by using Syndicate’s app
                  and its protocol, and to the extent necessary, will seek legal
                  counsel to ensure compliance with securities laws in relevant
                  jurisdictions.
                </li>
                <li>
                  Any information or documentation provided has not been
                  prepared with my specific circumstances in mind and may not be
                  suitable for use in my personal circumstances.
                </li>
                <li>
                  Syndicate or any of its advisors (including Syndicate’s tax
                  and legal advisors) have not provided me any legal advice or
                  other professional advice, and no confidential or special
                  relationship between me and Syndicate or its affiliates or
                  advisors exists.
                </li>
                <li>
                  I will not use Syndicate’s app and its protocol to engage in
                  illegal, fraudulent or other wrongful conduct, including but
                  not limited to (a) distributing defamatory, obscene or
                  unlawful content or content that promotes bigotry, racism,
                  misogyny or religious or ethnic hatred, (b) transmitting any
                  information or data that infringes any intellectual property
                  rights of any third party or that is otherwise libelous,
                  unlawful, or tortious, (c) stalking, harassment, or
                  threatening others with violence or abuse, or (d) violating
                  any anti-money laundering laws, anti-terrorist financing laws,
                  anti-bribery or anti-boycott laws, or other applicable laws.
                </li>
              </ul>
            </animated.div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewDetails;
