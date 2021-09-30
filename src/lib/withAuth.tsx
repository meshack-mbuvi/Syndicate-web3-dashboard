import { useRouter } from "next/router";
import type { FC } from "react";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

type withAuthenticationFn = (Component: FC) => any;

const WithAuth: withAuthenticationFn = (Component) => {
  const Authenticated: FC = (props): JSX.Element | null => {
    const router = useRouter();
    const AuthUser = useAuthUser();

    // User not authenticated
    // Redirect to sign-in
    if (!AuthUser.firebaseUser) {
      router.push("/sign-in");
      return <div>Loading...</div>;
    }

    // User authenticated
    // Check if isApproved
    if (!AuthUser.claims.isApproved) {
      // not approved
      // TODO: Redirect to reserve
      router.push("/reserve");
      // return <div>Not Approved, TODO: Redirect to reserve</div>;
    }

    // User authenticated and isApproved
    return <Component {...props} />;
  };

  return withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  })(Authenticated);
};

export default WithAuth;
