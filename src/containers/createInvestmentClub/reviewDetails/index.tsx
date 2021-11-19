import React from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useTransition, animated } from "react-spring";
import { format } from "date-fns";
import { AppState } from "@/state";
import useUSDCDetails from "@/hooks/useUSDCDetails";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";

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
    <div className="w-full mb-12">
      {investmentClubTransition((styles, item) =>
        item ? (
          <animated.div style={styles}>
            {investmentClubHeaderTransition((styles, item) =>
              item ? (
                <animated.p style={styles} className="text-sm text-gray-syn4">
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
          </animated.div>
        ) : null,
      )}
      {tokenCapTransition((styles, item) =>
        item ? (
          <animated.div style={styles} className="mt-8">
            {tokenCapHeaderTransition((styles, item) =>
              item ? (
                <animated.p style={styles}>
                  How much are you raising?
                </animated.p>
              ) : null,
            )}
            <div className="flex mt-2 text-base">
              <p className="text-white">{floatedNumberWithCommas(tokenCap)}</p>
              {usdcTransition((styles, item) =>
                item ? (
                  <animated.div
                    style={styles}
                    className="ml-4 text-gray-syn4 flex"
                  >
                    <Image src={depositTokenLogo} height={24} width={24} />
                    <p className="ml-2 text-base">{depositTokenSymbol}</p>
                  </animated.div>
                ) : null,
              )}
            </div>
          </animated.div>
        ) : null,
      )}

      {mindEndTimeTransition((styles, item) =>
        item ? (
          <animated.div className="mt-8" style={styles}>
            {mindEndTimeHeaderTransition((styles, item) =>
              item ? (
                <animated.p style={styles} className="text-sm text-gray-syn4">
                  How long will deposits be accepted?
                </animated.p>
              ) : null,
            )}
            <div className="flex mt-2 text-base">
              {!mintEndTime?.mintTime || mintEndTime?.mintTime === "Custom" ? (
                <></>
              ) : (
                <p className="text-white mr-4">{mintEndTime?.mintTime}</p>
              )}
              <p className="text-gray-syn4">
                {format(
                  new Date(
                    mintEndTime?.value ? mintEndTime?.value * 1000 : new Date(),
                  ),
                  "MMM dd, yyyy, hh:mm b",
                )}
              </p>
            </div>
          </animated.div>
        ) : null,
      )}
      {memberCountTransition((styles, item) =>
        item ? (
          <animated.div className="mt-8" style={styles}>
            {memberCountHeaderTransition((styles, item) =>
              item ? (
                <animated.p style={styles} className="text-sm text-gray-syn4">
                  How many members can join?
                </animated.p>
              ) : null,
            )}
            <div className="flex mt-2 text-base">
              <p className="text-white">{membersCount}</p>
            </div>
          </animated.div>
        ) : null,
      )}
    </div>
  );
};

export default ReviewDetails;
