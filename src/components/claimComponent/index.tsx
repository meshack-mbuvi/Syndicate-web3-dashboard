import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ErrorBoundary from "../errorBoundary";
import { Spinner } from "../shared/spinner";
import { MagicLinkClaimHandler } from "./MagicLinkClaim";

export const ClaimComponent = (): JSX.Element => {
  const router = useRouter();

  const [status, setStatus] = useState<number>(0);

  const { uuid } = router.query;

  const handleClaimVerification = async () => {
    const status = await MagicLinkClaimHandler.get(uuid.toString());

    setStatus(status);
  };

  useEffect(() => {
    if (status === 404) {
      router.push(process.env.NEXT_PUBLIC_WAITLIST_LINK);
    } else if (status === 200) {
      router.push("/clubs/create");
    }
  }, [status, router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      handleClaimVerification();
    }
  }, [router.isReady]);

  return (
    <ErrorBoundary>
      <div className="my-36 flex justify-around">
        <div className="flex flex-col justify-end">
          <div className="flex justify-center">
            <Spinner />
          </div>
          <p>Please wait, we are verifying your claim id.</p>
        </div>
      </div>
    </ErrorBoundary>
  );
};
