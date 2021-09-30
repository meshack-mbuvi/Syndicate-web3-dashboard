// This page lists all syndicates.
import withAuth from "@/lib/withAuth";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import React from "react";
import Syndicates from "src/containers/syndicates";

const SyndicatesPage = () => {
  return <Syndicates />;
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
})(withAuth(SyndicatesPage));
