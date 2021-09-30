// feeds page.

import withAuth from "@/lib/withAuth";
import Feed from "src/containers/feed";

const FeedPage = () => {
  return <Feed />;
};

export default withAuth(FeedPage);
