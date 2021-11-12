import { useRouter } from "next/router";
import { useEffect } from "react";
export const Index = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      router.replace(process.env.NEXT_PUBLIC_WAITLIST_LINK);
    }
  }, [router.isReady]);

  return <div></div>;
};

export default Index;
