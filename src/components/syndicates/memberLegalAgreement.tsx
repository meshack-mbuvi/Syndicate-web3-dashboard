import { NumberField } from '@/components/inputs/numberField';
import { TextField } from '@/components/inputs/textField';
import { AppState } from '@/state';
import { setClubLegalInfo, setMemberLegalInfo } from '@/state/legalInfo';
import { numberWithCommas } from '@/utils/formattedNumbers';
// See this issue to find out why yup is imported this way
// https://github.com/react-hook-form/resolvers/issues/271
import { yupResolver } from '@hookform/resolvers/yup';
import { decode } from 'js-base64';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import ArrowDown from '/public/images/arrowDown.svg';

interface FormInputs {
  memberName: string;
  depositAmount: string;
  emailAddress: string;
}

const schema = (maxDeposit: number) => {
  const depositRangeError = `Greater than the maximum deposit amount of ${numberWithCommas(
    maxDeposit
  )} set by the club admin`;

  return yup.object({
    memberName: yup.string().required("Member's full name is required."),
    depositAmount: yup
      .number()
      .required('Subscription amount is required.')
      .moreThan(0, 'Subscription amount is required.')
      .max(+maxDeposit, depositRangeError)
      .required('Subscription amount is required.')
      .typeError('Invalid amount'),
    emailAddress: yup
      .string()
      .email('Email address must be a valid email.')
      .required('Email address is required.')
  });
};

const LegalAgreement: React.FC = () => {
  const router = useRouter();

  const { clubAddress } = router.query;
  const dispatch = useDispatch();

  const {
    legalInfoReducer: {
      clubInfo: { adminName }
    },
    connectClubMemberReducer: {
      connectedMember: { depositAmount }
    },
    erc20TokenSliceReducer: {
      erc20Token,
      depositDetails: { depositTokenSymbol }
    }
  } = useSelector((state: AppState) => state);

  const { form } = router.query;
  // Check whether form query param exist when page has loaded
  useEffect(() => {
    if (router.isReady && !form) {
      router.push('/clubs');
    }
  }, [router, form]);

  // Retrieve form URL params and save them to formData
  useEffect(() => {
    if (router.isReady) {
      try {
        dispatch(
          setClubLegalInfo(
            JSON.parse(decode(decodeURIComponent(form as string)))
          )
        );
      } catch (e) {
        router.push('/clubs');
      }
    }
  }, [router.isReady, form]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid }
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: { depositAmount: depositAmount || '' },
    resolver: yupResolver(schema(erc20Token.maxTotalDeposits))
  });

  const { memberName = '' } = watch();

  const onSubmit = (values) => {
    dispatch(setMemberLegalInfo(values));
    router.push(`/clubs/${clubAddress}/member/legal/sign`);
  };

  return (
    <div className="flex flex-col lg:flex-row px-6-percent space-x-0 md:space-x-30 lg:space-x-32 2xl:space-x-48">
      <div className="w-1/4 xl:block hidden" />
      <div className="w-full md:w-full lg:w-2/3 xl:w-1/2">
        <p className="mb-8 text-xl">Sign legal documents</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-14">
            <TextField
              label="Member name"
              name="memberName"
              control={control}
              placeholder="Member’s full name"
              showWarning={
                memberName && memberName?.trim().split(' ').length < 2
              }
              warningText="Member name should have first and last names"
            />

            <NumberField
              label="Deposit amount"
              name="depositAmount"
              type="number"
              addOn={depositTokenSymbol}
              control={control}
              info="Amount you intend to deposit into the investment club"
              addOnStyles=""
              defaultValue={depositAmount}
            />

            <TextField
              label="Email"
              name="emailAddress"
              control={control}
              placeholder="Email address"
              info="To receive a copy of completed documents"
            />

            <div className="space-y-4">
              {/* Additional information */}
              <div className="font-whyte">
                Additional subscriber information
              </div>
              <div className="text-gray-syn4 font-whyte">
                Fill out and send to the club’s admin, {adminName?.toString()}.
              </div>
              <div className="flex">
                <a
                  href="https://docs.google.com/document/d/1OdXXdaX5eJZCc_xKQsrC6NrX-XrBFQbu/edit#"
                  className="text-blue cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="rounded-full flex justify-between px-3 py-2 font-whyte border border-blue">
                    <span className="mr-1">Exhibit A, B & C.pdf</span>
                    <span>
                      <Image src={ArrowDown} width="12" height="15" alt="" />
                    </span>
                  </p>
                </a>
              </div>
              <div className="text-gray-syn4 font-whyte">
                For your privacy, Syndicate does not store documents with
                personal identifiable information (PII).
              </div>
            </div>
          </div>

          <div className="flex flex-col border-t border-gray-erieBlack mt-10">
            <div className="relative flex items-center my-7.5 justify-between">
              <button className="flex items-center py-3.5 text-gray-lightManatee text-base opacity-80 hover:opacity-100 focus:outline-none">
                <img className="w-5 h-5" src="/images/arrowBack.svg" alt="" />
                <span className="ml-2">Back</span>
              </button>
              <button
                className={`${
                  !isValid
                    ? 'primary-CTA-disabled text-gray-lightManatee'
                    : 'primary-CTA hover:opacity-90 transition-all'
                }`}
                type="submit"
              >
                Review and sign
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="w-full lg:w-1/3 xl:w-1/4 sticky top-20 h-full">
        <div className="text-xl mb-2">What happens next?</div>
        <div className="text-gray-syn4">
          This information will be populated in the final legal agreements,
          which you’ll be able to review and sign.
        </div>
      </div>
    </div>
  );
};

export default LegalAgreement;
