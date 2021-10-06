// This page lists all syndicates.
import { withLoggedOutUser } from "@/lib/withAuth";
import Syndicates from "src/containers/syndicates";

export default withLoggedOutUser(Syndicates);
