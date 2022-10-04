import ErrorBoundary from '@/components/errorBoundary';
import { Checkbox } from '@/components/inputs/checkbox';
import { TextArea } from '@/components/inputs/textArea';
import { TextField } from '@/components/inputs/textField';
import Head from '@/components/syndicates/shared/HeaderTitle';
import { setClubLegalInfo } from '@/state/legalInfo';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

interface FormInputs {
  legalEntityName: string;
  isSeriesLLC: boolean;
  masterLLC: string;
  adminName: string;
  counselName: string;
  location: string;
  managerEmail: string;
  counselEmail: string;
  generalPurposeStatement: string;
}

const schema = yup.object({
  legalEntityName: yup.string().required('Legal entity name is required'),
  isSeriesLLC: yup.boolean(),
  adminName: yup.string().required('Admin name is required'),
  counselName: yup.string().trim(),
  counselEmail: yup
    .string()
    .email('Invalid email address')
    .when('counselName', {
      is: (counselName: any) => counselName?.trim().length > 0,
      then: yup
        .string()
        .email('Invalid email address')
        .required('Email is required')
    }),
  location: yup.string().required('Location is required'),
  managerEmail: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  masterLLC: yup.string().when('isSeriesLLC', {
    is: true,
    then: yup.string().required('Master LLC is required')
  }),
  generalPurposeStatement: yup
    .string()
    .required('General purpose statement is required')
});

/**
 * This page shows the manager component for a given syndicate address
 */
const CreateAgreementComponent: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
    setValue
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const { isSeriesLLC, adminName, location, counselName } = watch();
  const dispatch = useDispatch();

  const router = useRouter();
  const { clubAddress } = router.query;

  const setFormValues = (clubData: any) => {
    for (const [key, value] of Object.entries(clubData)) {
      if (key === 'legalEntityName' && clubData.isSeriesLLC) {
        setValue('legalEntityName', clubData.seriesLLC, {
          shouldValidate: true
        });
      } else {
        setValue(key as any, value, { shouldValidate: true });
      }
    }
  };

  useEffect(() => {
    const legal = JSON.parse(localStorage.getItem('legal') || '{}');
    const clubLegalData = legal[clubAddress as string];
    const clubData = clubLegalData?.clubData;
    if (clubData && clubLegalData?.signaturesNeeded) {
      setFormValues(clubData);
    }
  }, [clubAddress, router]);

  const onSubmit = (values: any) => {
    dispatch(
      setClubLegalInfo({
        ...values,
        dueDate: moment().add(30, 'days').format('LL'),
        adminSignDate: moment().format('LL')
      })
    );
    router.push(`/clubs/${clubAddress}/manage/legal/sign`);
  };

  return (
    <ErrorBoundary>
      <Head title="Prepare legal Documents" />
      <div className="flex flex-col lg:flex-row px-6-percent space-x-0 md:space-x-30 lg:space-x-32 2xl:space-x-48">
        <div className="w-1/4 xl:block hidden" />
        <div className="w-full md:w-full lg:w-2/3 xl:w-1/2">
          <div className="flex flex-col pb-6">
            <div className="text-xl mb-8 font-whyte">
              Prepare legal documents
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-14">
              <div className="relative">
                {/* checkbox for isSeriesLLC */}
                <TextField
                  label="Legal entity name"
                  name="legalEntityName"
                  cornerHint={{
                    text: (
                      <a
                        href="https://guide.syndicate.io/en/web3-investment-clubs/create-a-legal-entity"
                        target="_blank"
                        rel="noreferrer"
                        style={{ float: 'right' }}
                      >
                        Help me form one first
                      </a>
                    ),
                    textColor: 'text-blue'
                  }}
                  control={control}
                  placeholder="Name of existing LLC"
                />

                <Checkbox
                  control={control}
                  name="isSeriesLLC"
                  label={'This is a series of a master LLC'}
                />

                {isSeriesLLC && (
                  <div className="pt-4">
                    <TextField
                      name="masterLLC"
                      control={control}
                      placeholder="Name of master LLC"
                    />
                  </div>
                )}
              </div>

              <TextField
                label="Administrative member name"
                name="adminName"
                control={control}
                placeholder="Admin’s full name"
                info="This is the person who will pay expenses and perform admin
                    functions for the club, such as reviewing member
                    documentation and coordinating tax reporting."
                showWarning={adminName?.trim().split(' ').length < 2}
                warningText="Admin name should have first and last names"
              />

              <TextField
                label="Arbitration location"
                name="location"
                control={control}
                placeholder="e.g. San Francisco, California"
                info={
                  <span>
                    Choose the city and state where you would like to have
                    disputes resolved. This place should be convenient to visit,
                    and have state laws and infrastructure that you are
                    comfortable with.
                  </span>
                }
                showWarning={location?.trim().split(',').length < 2}
                warningText="Location should be formatted as City, State"
              />

              <TextArea
                label="General purpose statement"
                name="generalPurposeStatement"
                control={control}
                placeholder="e.g. to facilitate the acquisition, disposition, ownership, and management of investments "
              />

              <div>
                <TextField
                  label="Outside counsel"
                  name="counselName"
                  cornerHint={{ text: 'If applicable' }}
                  control={control}
                  placeholder="Name of counsel"
                  showWarning={counselName?.trim().split(' ').length < 2}
                  warningText="Counsel name should have first and last names"
                />

                <TextField
                  name="counselEmail"
                  control={control}
                  placeholder="Email of counsel"
                />
              </div>

              <TextField
                label="Email"
                name="managerEmail"
                control={control}
                placeholder="Email address"
                info="To receive a copy of completed documents"
              />
              <div className=" mt-14">
                <div className="flex flex-col border-t border-gray-erieBlack">
                  <div className="relative flex items-center h-28 justify-between">
                    <button className="flex items-center py-3.5 text-gray-lightManatee text-base opacity-80 hover:opacity-100 focus:outline-none">
                      <img
                        className="w-5 h-5"
                        src="/images/arrowBack.svg"
                        alt=""
                      />
                      <span className="ml-2">Back</span>
                    </button>
                    <button
                      className={`${
                        !isValid
                          ? 'primary-CTA-disabled text-gray-lightManatee'
                          : 'primary-CTA hover:opacity-90 transition-all'
                      }`}
                      type="submit"
                      disabled={!isValid}
                    >
                      Generate my documents
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full lg:w-1/3 xl:w-1/4 sticky top-20 h-full">
          <div className="text-xl mb-2">What happens next?</div>
          <div className="text-gray-syn4">
            After filling out this template to generate both forms, you’ll
            receive a link to send out to members of your investment club for an
            invitation to sign and deposit.
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CreateAgreementComponent;
