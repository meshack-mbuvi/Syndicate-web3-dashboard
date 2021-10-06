import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import { FC, useEffect } from "react";
import { useRouter } from "next/router";

export const withLoggedInUser = withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenAuthed: AuthAction.RENDER,
});

export const withAuth = withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
});

export const withApprovedUser = (Component: FC) => {
  const WrapperComponent: FC = (props) => {
    const router = useRouter()
    const { claims: { isApproved = false } } = useAuthUser()

    useEffect(() => {
      if (!isApproved) {
        router.push("/reserve")
      }
    }, [isApproved, router])

    if (!isApproved) return null

    return <Component {...props} />
  }

  return withLoggedInUser(WrapperComponent)
}
