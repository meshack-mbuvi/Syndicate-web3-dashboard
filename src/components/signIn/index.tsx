import { useAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect } from "react";
import SignInButton from "./SignInButton";

const SignInComponent: FC = () => {
  const currentUser = useAuthUser();
  const router = useRouter();

  const goToWaitlist = useCallback(() => {
    router.push("/reserve/");
  }, [router]);

  const goToSyndicates = useCallback(() => {
    router.push("/syndicates/");
  }, [router]);

  useEffect(() => {
    if (!currentUser.id) return;
    if (currentUser.claims.isApproved) {
      goToSyndicates();
    } else {
      goToWaitlist();
    }
  }, [
    currentUser.claims.isApproved,
    currentUser.id,
    goToSyndicates,
    goToWaitlist,
  ]);

  return (
    <>
      <div className="mx-auto w-1/3 mt-32">
        <h2 className="font-white text-2xl leading-10">Sign in to Syndicate</h2>
        <p className="leading-6 py-4">
          Follow syndicates, manage your profile, and more by signing in with
          your Twitter account. We never link your account to your wallet.
        </p>
        <SignInButton />

        <div className="pt-20">
          <div className="flex flex-col items-center px-14 text-sm">
            <img src="/images/lock.svg" alt="lock" />
            <p className="py-4 text-gray-3 text-center">
              We take security and privacy very seriously and you’re always in
              control. Syndicate is built with industry-leading best practices
              to keep your data safe and private.
            </p>
            {/* TODO: Implement link when designs are ready */}
            {/* <div className="flex">
              <span className="text-blue-navy px-1">
                Learn more about how we keep your data secure
              </span>
              <img src="/images/chevron-left-blue.svg" alt="" />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInComponent;
