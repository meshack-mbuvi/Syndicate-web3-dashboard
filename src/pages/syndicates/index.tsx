// This page lists all syndicates.
import { withLoggedInUser } from "@/lib/withAuth";
import Syndicates from "src/containers/syndicates";

export default withLoggedInUser(Syndicates);
