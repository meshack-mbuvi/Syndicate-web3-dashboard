// This page deals with deposits or withdrawals to a club.
import { useEffect } from "react";
import { useRouter } from "next/router";

const GenerateDai = () => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CONTEXT === "production") {
      router.replace("/");
    } else {
      // re-route to the generate-token
      router.replace(`/rinkeby/generate-token`);
    }
  }, []);
  return <div> </div>;
};

export default GenerateDai;
