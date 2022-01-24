import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import useUSDCDetails from "@/hooks/useUSDCDetails";
import { AppState } from "@/state";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
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
  } = useSelector((state: AppState) => state.createInvestmentClubSliceReducer);

  const { depositTokenSymbol, depositTokenLogo } = useUSDCDetails();
  const { currentStep } = useCreateInvestmentClubContext();
  const { setBackBtnDisabled, setNextBtnDisabled } =
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
  const [agreementSecondChecked, setAgreementSecondChecked] =
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
    } else if (
      (currentStep >= 4 && !agreementFirstChecked) ||
      (!agreementSecondChecked && !editMembersCount)
    ) {
      setNextBtnDisabled(true);
    } else {
      setNextBtnDisabled(false);
    }

    // temporary solution for edge case of Back button and then review again
    if (currentStep < 4) {
      setAgreementFirstChecked(false);
      setAgreementSecondChecked(false);
    }
  }, [
    editClubNameSelector,
    editAmountToRaise,
    editMintMaxDate,
    editMembersCount,
    currentStep,
    setNextBtnDisabled,
    agreementFirstChecked,
    agreementSecondChecked,
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
      <div className="w-full lg:w-2/3 mb-6">
        {editClubNameSelector ? (
          <animated.div className="relative w-full mb-2 pt-2 pb-2 pl-5 pr-5">
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
                className="flex justify-between pl-5 pr-5 pt-4 pb-4"
                style={
                  inlineEditView === "investmentClub" && currentStep == 4
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
                    <>
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
                    </>
                  )}
                </animated.div>
                {inlineEditView === "investmentClub" && currentStep == 4 ? (
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
            <AmountToRaise editButtonClicked={editAmountToRaise} />
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
                className="flex justify-between pl-5 pr-5 pt-4 pb-4"
                style={
                  inlineEditView === "tokenCap" && currentStep == 4
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
                    <AmountToRaise className="w-full lg:w-full" />
                  ) : (
                    <>
                      {tokenCapHeaderTransition((styles, item) =>
                        item ? (
                          <animated.p style={styles}>
                            How much are you raising?
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
                    </>
                  )}
                </animated.div>
                {inlineEditView === "tokenCap" && currentStep == 4 ? (
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
          <animated.div className="relative w-full mt-4 mb-2 pl-5 pr-5 pt-2 pb-2">
            <MintMaxDate />
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
                className="flex justify-between pl-5 pr-5 pt-4 pb-4"
                style={
                  inlineEditView === "mindEnd" && currentStep == 4
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
                    <MintMaxDate className="w-full lg:w-full" />
                  ) : (
                    <>
                      {mindEndTimeHeaderTransition((styles, item) =>
                        item ? (
                          <animated.p
                            style={styles}
                            className="text-sm text-gray-syn4"
                          >
                            How long will deposits be accepted?
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
                    </>
                  )}
                </animated.div>
                {inlineEditView === "mindEnd" && currentStep == 4 ? (
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
          <animated.div className="relative w-full pl-5 pt-2 pb-2 pr-5">
            <MembersCount
              editButtonClicked={editMembersCount}
              className="w-full lg:w-full"
              setInputHasError={setMemberCountHasError}
            />
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
                className="flex justify-between pl-5 pr-5 pt-4 pb-4"
                style={
                  inlineEditView === "memberCount" && currentStep == 4
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
                    <MembersCount />
                  ) : (
                    <>
                      {memberCountHeaderTransition((styles, item) =>
                        item ? (
                          <animated.p
                            style={styles}
                            className="text-sm text-gray-syn4"
                          >
                            How many members can join?
                          </animated.p>
                        ) : null,
                      )}
                      <div className="flex mt-2 text-base">
                        <p className="text-white">{membersCount}</p>
                      </div>
                    </>
                  )}
                </animated.div>
                {inlineEditView === "memberCount" && currentStep == 4 ? (
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
        <div className="w-full lg:w-2/3 mb-6">
          <div className="flex items-center space-between pl-5 pr-5 mb-5">
            <input
              className="bg-transparent rounded focus:ring-offset-0"
              onChange={() => setAgreementFirstChecked(!agreementFirstChecked)}
              type="checkbox"
              id="agreementFirst"
              name="agreementFirst"
            />
            <animated.p className="text-sm text-gray-syn4 ml-5">
              I represent that my access and use of Syndicate’s app and its
              protocol will fully comply with all applicable laws and
              regulations, including United States securities laws, and that I
              will not access or use the protocol to conduct, promote, or
              otherwise facilitate any illegal activity.{" "}
            </animated.p>
          </div>
          <div className="flex items-center space-between pl-5 pr-5 mb-5">
            <input
              className="bg-transparent rounded focus:ring-offset-0"
              onChange={() =>
                setAgreementSecondChecked(!agreementSecondChecked)
              }
              type="checkbox"
              id="agreementSecond"
              name="agreementSecond"
            />
            <animated.p className="text-sm text-gray-syn4 ml-5">
              By accessing and using Syndicate’s app and its protocol, I
              represent that I will seek advice from my own legal counsel and
              financial advisors. I understand and agree to assume full
              responsibility for all of the risks of accessing and using
              Syndicate’s app to interact with the Syndicate protocol.{" "}
            </animated.p>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewDetails;
