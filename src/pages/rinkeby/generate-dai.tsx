// This page deals with deposits or withdrawals to a syndicate.
import { useEffect } from "react";
import { useRouter } from "next/router";

const GenerateDai = () => {
  const router = useRouter();

  useEffect(() => {
    // re-route to the generate-token
    router.replace(`/rinkeby/generate-token`);
  }, []);
  return(<div> </div>);
};

export default GenerateDai;
