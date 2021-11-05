import ErrorBoundary from "@/components/errorBoundary";
import FadeIn from "@/components/fadeIn/FadeIn";
import JoinWaitlist from "@/components/JoinWaitlist";
import { SkeletonLoader } from "@/components/skeletonLoader";
import StatusBadge from "@/components/syndicateDetails/statusBadge";
import { useUnavailableState } from "@/components/syndicates/hooks/useUnavailableState";
import { UnavailableState } from "@/components/syndicates/shared/unavailableState";
import { RootState } from "@/redux/store";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import ManagerActionCard from "./managerActionCard";

const ManagerActions = (): JSX.Element => {
  const {
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: RootState) => state);
  const { loading, depositsEnabled } = erc20Token;

  const { title, message, renderUnavailableState, renderJoinWaitList } =
    useUnavailableState("manage");

  const actions = [
    {
      grayIcon: (
        <Image
          src="/images/managerActions/create_public_profile.svg"
          alt="Public profile icon"
          width={16}
          height={16}
        />
      ),
      whiteIcon: (
        <Image
          src="/images/managerActions/create_public_profile_white.svg"
          alt="Public profile icon"
          width={16}
          height={16}
        />
      ),
      title: "Create a public-facing social profile",
      onClickHandler: () => console.log("TODO:Remove this"),
      description:
        "Help others understand this syndicate by requesting a social profile. We’ll help you create it.",
    },
  ];

  if (renderUnavailableState || renderJoinWaitList) {
    return (
      <div className="h-fit-content px-8 pb-4 pt-5 bg-gray-9 rounded-2xl">
        <div className="flex justify-between my-1 px-2">
          {renderJoinWaitList ? (
            <JoinWaitlist />
          ) : (
            renderUnavailableState && (
              <UnavailableState title={title} message={message} />
            )
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="h-fit-content rounded-2xl p-4 md:mx-2 md:p-6 bg-gray-9 mt-6 md:mt-0 w-full">
          <div className="mb-6">
            <SkeletonLoader width="full" height="10" />
          </div>
          <div className="mb-4">
            <SkeletonLoader width="full" height="12" />
          </div>
          <div className="mb-4">
            <SkeletonLoader width="full" height="12" />
          </div>
          <div className="mb-4">
            <SkeletonLoader width="full" height="12" />
          </div>
        </div>
        <div className="w-40" />
        <div className="my-6 mx-4">
          <SkeletonLoader width="72" height="10" />
          <div className="my-6">
            <SkeletonLoader width="full" height="12" />
          </div>
          <div className="mb-6">
            <SkeletonLoader width="full" height="12" />
          </div>
        </div>
      </>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full mt-4 sm:mt-0">
        <FadeIn>
          <div className="h-fit-content rounded-2-half bg-gray-syn8">
            <StatusBadge depositsEnabled={depositsEnabled} />
            <div className="h-fit-content rounded-2-half mt-6 mb-2 md:mt-0 pb-8">
              <div className="pl-8 md:pl-6 pr-4">
                <div
                  className={`text-sm font-bold uppercase tracking-wider m-4 mr-4 ml-0 md:ml-0 md:m-3 md:mr-5 md:mt-5`}
                >
                  Manager Actions
                </div>

                {actions.map(
                  ({
                    whiteIcon,
                    grayIcon,
                    title,
                    description,
                    onClickHandler,
                  }) => {
                    return (
                      <ManagerActionCard
                        title={title}
                        description={description}
                        whiteIcon={whiteIcon}
                        grayIcon={grayIcon}
                        onClickHandler={onClickHandler}
                        key={title}
                      />
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </ErrorBoundary>
  );
};

export default ManagerActions;
