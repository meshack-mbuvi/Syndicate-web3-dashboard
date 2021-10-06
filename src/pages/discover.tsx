// This is the discover page.
import { FC } from "react";
import { DiscoverContent } from "src/containers/discover";
import {withAuth} from "@/lib/withAuth";

const DiscoverPage: FC = () => {
  return <DiscoverContent />;
};

export default withAuth(DiscoverPage);
