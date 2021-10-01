import Waitlist from "@/containers/waitlist";
import { withLoggedInUser } from "@/lib/withAuth";
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

export default withLoggedInUser(WaitlistPage);
