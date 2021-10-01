import {AuthAction, withAuthUser} from "next-firebase-auth";

export const withLoggedInUser = withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenAuthed: AuthAction.RENDER
});
