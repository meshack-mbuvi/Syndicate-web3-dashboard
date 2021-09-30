import {
  TwitterAuthProvider,
  browserSessionPersistence,
  getAdditionalUserInfo,
  getAuth,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import { useAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useState } from "react";
import Button from "src/components/buttons";

interface TwitterProfile {
  id_str: string;
  screen_name: string;
  name: string;
  profile_image_url: string;
  description: string;
  email: string;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  location: string;
}

const handleSignInWithTwitter = async () => {
  const auth = getAuth();
  await setPersistence(auth, browserSessionPersistence);

  const provider = new TwitterAuthProvider();
  const credential = await signInWithPopup(auth, provider);

  const { user } = credential;
  const { profile } = getAdditionalUserInfo(credential);
  const twitter = profile as any as TwitterProfile;

  return { user, twitter };
};

const SignInComponent: FC = () => {
  const currentUser = useAuthUser();
  const router = useRouter();

  const goToWaitlist = useCallback(() => {
    router.push("/reserve/");
  }, [router]);

  useEffect(() => {
    if (currentUser.id) {
      goToWaitlist();
    }
  }, [currentUser.id, goToWaitlist]);

  const [isSigningIn, setSigningIn] = useState(false);

  const handleSignIn = useCallback(async () => {
    try {
      setSigningIn(true);
      await handleSignInWithTwitter();
      goToWaitlist();
    } catch (error) {
      console.log({ error });
      setSigningIn(false);
    }
  }, [goToWaitlist]);

  return (
    <>
      <div className="mx-auto w-1/3 mt-32">
        <h2 className="font-white text-2xl leading-10">Sign in to Syndicate</h2>
        <p className="leading-6 py-4">
          Follow syndicates, manage your profile, and more by signing in with
          your Twitter account. We never link your account to your wallet.
        </p>
        <Button
          customClasses="my-4 primary-CTA mx-auto w-full"
          textColor="text-black"
          disabled={isSigningIn}
          icon="/images/social/twitter-blue.svg"
          onClick={handleSignIn}
        >
          Sign in with Twitter
        </Button>

        <div className="pt-20">
          <div className="flex flex-col items-center px-14 text-sm">
            <img src="/images/lock.svg" alt="lock" />
            <p className="py-4 text-gray-3 text-center">
              We take security and privacy very seriously and you’re always in
              control. Syndicate is built with industry-leading best practices
              to keep your data safe and private.
            </p>
            <div className="flex">
              <span className="text-blue-navy px-1">
                Learn more about how we keep your data secure
              </span>
              <img src="/images/chevron-left-blue.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInComponent;
