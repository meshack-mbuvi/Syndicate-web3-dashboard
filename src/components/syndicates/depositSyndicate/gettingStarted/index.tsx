import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { DiscordLink } from '@/components/DiscordLink';
import { EmailSupport } from '@/components/emailSupport';
import { Spinner } from '@/components/shared/spinner';
import { resetClubState, setERC20Token } from '@/helpers/erc20TokenDetails';
import { AppState } from '@/state';
import { CheckIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const GettingStarted: React.FC = () => {
  const router = useRouter();

  const { clubAddress, form } = router.query;
  const dispatch = useDispatch();

  const {
    web3Reducer: {
      web3: { account, web3, activeNetwork }
    },
    erc20TokenSliceReducer: { erc20Token }
  } = useSelector((state: AppState) => state);

  // Check whether form query param exist when page has loaded
  useEffect(() => {
    if (router.isReady && !form) {
      router.push('/clubs');
    }
  }, [router.isReady]);

  // @ts-expect-error TS(7030): Not all code paths return a value.
  useEffect(() => {
    if (!activeNetwork.chainId) return;
    if (router.isReady && web3.utils.isAddress(clubAddress as string)) {
      const clubERC20tokenContract = new ClubERC20Contract(
        clubAddress as string,
        web3,
        activeNetwork
      );

      dispatch(setERC20Token(clubERC20tokenContract));

      return () => {
        resetClubState(dispatch);
      };
    }
  }, [clubAddress, account, router.isReady, activeNetwork]);

  const { name, loading, depositsEnabled } = erc20Token;

  const memberHasSigned = false;

  const handleGetStarted = () => {
    router.push(`/clubs/${clubAddress}/member/legal/prepare?form=${form}`);
  };

  const steps = [
    {
      name: 'Sign legal agreements',
      description:
        'Review and sign the legal agreements prepared by the club’s administrator',
      status: 'current'
    },
    {
      name: 'Deposit and invest together!',
      description: '',
      status: 'next'
    }
  ];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div
          className="pt-8 pb-6 px-5 rounded-2-half bg-gray-syn8 w-100"
          style={{ marginTop: '78px' }}
        >
          {depositsEnabled ? (
            <div>
              <div className="mx-5">
                <p className="uppercase text-sm leading-4 tracking-px text-white mb-8 font-bold">
                  You’ve been invited to join {name}
                </p>
                <div style={{ marginBottom: 72 }}>
                  <nav aria-label="Progress">
                    <ol className="overflow-hidden">
                      {steps.map((step, stepIdx) => (
                        <li
                          key={step.name}
                          className={classNames(
                            stepIdx !== steps.length - 1 ? 'pb-6' : '',
                            'relative'
                          )}
                        >
                          {step.status === 'current' ? (
                            <>
                              {stepIdx !== steps.length - 1 ? (
                                <div
                                  className={`-ml-px absolute mt-1 top-4 left-2.5 w-0.5 h-full ${
                                    memberHasSigned ? 'bg-blue' : 'bg-gray-syn6'
                                  } `}
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex items-start group">
                                {memberHasSigned ? (
                                  <span
                                    className=" h-6 flex items-center"
                                    aria-hidden="true"
                                  >
                                    <span className="w-5 h-5 bg-blue p-1 rounded-full flex justify-center items-center">
                                      <CheckIcon className="w-5 h-5 text-white" />
                                    </span>
                                  </span>
                                ) : (
                                  <span
                                    className="h-6 flex items-center"
                                    aria-hidden="true"
                                  >
                                    <span className="relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full border-blue">
                                      <span className="h-full w-full rounded-full" />
                                    </span>
                                  </span>
                                )}
                                <span className="ml-4 min-w-0 flex flex-col">
                                  <span className="text-white text-base leading-6 transition-all">
                                    {step.name}
                                  </span>
                                  {step.description && (
                                    <p className="text-gray-syn4 text-sm mt-1 leading-5.5">
                                      {step.description}
                                    </p>
                                  )}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                className="relative flex items-start group"
                                aria-current="step"
                              >
                                <span
                                  className="flex items-center"
                                  aria-hidden="true"
                                >
                                  <span
                                    className={`relative z-10 w-5 h-5 flex items-center justify-center bg-gray-syn8 border-2 ${
                                      memberHasSigned
                                        ? 'border-blue'
                                        : 'border-gray-syn6'
                                    } rounded-full`}
                                  >
                                    <span className="h-2.5 w-2.5 rounded-full" />
                                  </span>
                                </span>
                                <span className="ml-4 min-w-0 flex flex-col">
                                  <span className="text-gray-syn5 text-base leading-6 transition-all">
                                    {step.name}
                                  </span>
                                  {step.description && (
                                    <p className="text-gray-syn4 text-sm mt-1 leading-5.5">
                                      {step.description}
                                    </p>
                                  )}
                                </span>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>
                {!memberHasSigned ? (
                  <Link
                    href={`/clubs/${clubAddress}/member/legal/prepare?form=${form}`}
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a className="bg-green rounded-custom w-full flex items-center justify-center py-4">
                      <p className="text-black pr-1 whitespace-nowrap font-semibold">
                        Get started
                      </p>
                      <img
                        src="/images/actionIcons/arrowRightBlack.svg"
                        alt="arrow-right"
                      />
                    </a>
                  </Link>
                ) : (
                  <button
                    className="bg-green rounded-custom w-full flex items-center justify-center py-4"
                    onClick={() => handleGetStarted()}
                  >
                    <p className="text-black pr-1 whitespace-nowrap font-semibold">
                      Get started
                    </p>
                    <img
                      src="/images/actionIcons/arrowRightBlack.svg"
                      alt="arrow-right"
                    />
                  </button>
                )}
              </div>
              <div className="mt-10 mb-6 h-px bg-gray-syn6"></div>
              <p className="px-5 text-gray-syn4 text-sm leading-5.5">
                Questions? Contact us at <EmailSupport /> or on <DiscordLink />
              </p>
            </div>
          ) : (
            <div>
              <div className="mx-5">
                <p className="uppercase text-sm leading-4 tracking-px text-white font-bold">
                  Sign legal agreements for {name}
                </p>
                <div className="mt-4 mb-8">
                  <p className="text-gray-syn4 text-sm mt-1 leading-5.5">
                    Review and sign the legal agreements prepared by the club’s
                    administrator
                  </p>
                </div>
                <Link
                  href={`/clubs/${clubAddress}/member/legal/prepare?form=${form}`}
                >
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a className="bg-green rounded-custom w-full flex items-center justify-center py-4">
                    <p className="text-black pr-1 whitespace-nowrap font-semibold">
                      Get started
                    </p>
                    <img
                      src="/images/actionIcons/arrowRightBlack.svg"
                      alt="arrow-right"
                    />
                  </a>
                </Link>
              </div>
              <div className="mt-10 mb-6 h-px bg-gray-syn6"></div>
              <p className="px-5 text-gray-syn4 text-sm leading-5.5">
                Questions? Contact us at <EmailSupport /> or on <DiscordLink />
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GettingStarted;
