// feeds page.

import { withLoggedInUser } from "@/lib/withAuth";
import Feed from "src/containers/feed";

export default withLoggedInUser(Feed);
