import React, { FC, useCallback, useEffect, useState } from "react";
import {
  TwitterAuthProvider,
  browserSessionPersistence,
  getAdditionalUserInfo,
  getAuth,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import Button from "src/components/buttons";
import { useAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import { hideTwitterModal } from "@/redux/actions";
import { useDispatch } from "react-redux";

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

const SignInButton: FC = () => {
  const currentUser = useAuthUser();
  const dispatch = useDispatch();

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

  const [isSigningIn, setSigningIn] = useState(false);

  const handleSignIn = useCallback(async () => {
    try {
      // Twitter auth may happen on the modal
      // Hide modal
      dispatch(hideTwitterModal());
      setSigningIn(true);
      await handleSignInWithTwitter();
      goToWaitlist();
    } catch (error) {
      setSigningIn(false);
    }
  }, [dispatch, goToWaitlist]);

  return (
    <Button
      customClasses="my-4 primary-CTA mx-auto w-full"
      textColor="text-black"
      disabled={isSigningIn}
      icon="/images/social/twitter-blue.svg"
      onClick={handleSignIn}
    >
      Sign in with Twitter
    </Button>
  );
};

export default SignInButton;
