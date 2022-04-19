import { useRouter } from 'next/router';

export const DEMO_ADDRESS = 'demo';

export const useDemoMode = (address = ''): boolean => {
  const router = useRouter();
  const {
    query: { clubAddress }
  } = router;

  if (address) {
    return address === DEMO_ADDRESS;
  }

  return clubAddress === DEMO_ADDRESS;
};
