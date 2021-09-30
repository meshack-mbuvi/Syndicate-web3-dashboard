import Waitlist from "@/containers/waitlist";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import SEO from "src/components/seo";

const WaitlistPage = () => (
  <>
    <SEO
      keywords={"syndicate crypto invest fund social ethereum".split(" ")}
      title="Waitlist"
    />
    <Waitlist />
  </>
);

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  authPageURL: "/sign-in",
})(WaitlistPage);
