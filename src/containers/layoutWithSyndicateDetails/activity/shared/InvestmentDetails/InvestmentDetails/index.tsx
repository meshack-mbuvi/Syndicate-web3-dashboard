import { NumberField, TextField } from '@/components/inputs';
import ActivityDatePicker from '@/containers/layoutWithSyndicateDetails/activity/shared/ActivityDatePicker';
import { DataStorageInfo } from '@/containers/layoutWithSyndicateDetails/activity/shared/DataStorageInfo';
import RoundDropDown from '@/containers/layoutWithSyndicateDetails/activity/shared/InvestmentDetails/InvestmentDetails/RoundDropDown';
import PiiWarning from '@/containers/layoutWithSyndicateDetails/activity/shared/PiiWarning';
import { ANNOTATE_TRANSACTIONS } from '@/graphql/mutations';
import { AppState } from '@/state';
import { useMutation } from '@apollo/client';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

interface Details {
  companyName: string;
  costBasis: string;
  currentInvestmentValue: string;
  investmentDate: string;
  investmentRound: string;
  fullyDilutedOwnershipStake: string;
  numberShares: string;
  numberTokens: string;
}

interface IInvestmentDetailsModal {
  showModal: boolean;
  readonly: boolean;
  editMode: boolean;
  onClick: (e: any) => void;
  storedInvestmentDetails: Details | any;
  transactionId: string;
  setStoredInvestmentDetails: (details) => void;
  isManager: boolean;
  onSuccessfulAnnotation: () => void;
}

const InvestmentDetailsModal: React.FC<IInvestmentDetailsModal> = ({
  showModal,
  editMode,
  onClick,
  storedInvestmentDetails,
  transactionId,
  setStoredInvestmentDetails,
  isManager,
  onSuccessfulAnnotation
}) => {
  const disabled = !editMode;
  const [hover, setHover] = useState<boolean>(false);

  const {
    web3Reducer: {
      web3: { activeNetwork }
    },
    transactionsReducer: {
      currentTransaction: { blockTimestamp }
    }
  } = useSelector((state: AppState) => state);

  const setHoverState = (over) => {
    if (!editMode && over) {
      setHover(true);
    } else {
      setHover(false);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isDirty, dirtyFields }
  } = useForm<Details>({
    mode: 'onChange',
    defaultValues: storedInvestmentDetails
  });

  useEffect(() => {
    if (!isDirty && !isEmpty(dirtyFields) && !editMode) {
      // Reset if form has not been touched
      reset(storedInvestmentDetails);
    }
  }, [storedInvestmentDetails, reset, isDirty, dirtyFields, editMode]);

  useEffect(() => {
    if (!storedInvestmentDetails?.investmentDate) {
      //  Set the date to the current block timestamp
      setValue('investmentDate', new Date().toISOString());
    }
  }, [blockTimestamp, storedInvestmentDetails?.investmentDate]);

  // Annotation
  const [annotationMutation] = useMutation(ANNOTATE_TRANSACTIONS);

  const formValues = getValues();
  const {
    companyName,
    costBasis,
    currentInvestmentValue,
    investmentDate,
    investmentRound,
    fullyDilutedOwnershipStake,
    numberShares,
    numberTokens
  } = formValues;

  const onSubmit = (values) => {
    // fields without values will be sent to the backend as an empty string
    // this makes it possible to remove a previously set value.
    const detailsAnnotationData = {
      transactionId: transactionId,
      companyName: values?.companyName,
      postMoneyValuation: values?.costBasis,
      preMoneyValuation: values?.currentInvestmentValue,
      acquisitionDate: new Date(values?.investmentDate).toISOString(),
      equityStake: values?.fullyDilutedOwnershipStake,
      tokenAmount: values?.numberTokens,
      sharesAmount: values?.numberShares,
      roundCategory: values?.investmentRound
    };

    annotationMutation({
      variables: {
        transactionAnnotationList: [{ ...detailsAnnotationData }]
      },
      context: { clientName: 'backend', chainId: activeNetwork.chainId }
    });
    setStoredInvestmentDetails(values);
    reset(values, {
      keepValues: true
    });
    onClick(values);
    onSuccessfulAnnotation();
  };

  const borderStyles =
    'border-b-1 border-gray-syn6 border-collapse text-gray-syn4';
  const dateBorderStyles = `w-full flex-row ${borderStyles}`;
  const details = Object.values(formValues);

  return (
    <>
      {editMode || details.join('').length ? (
        <div
          className={`border border-none px-5 pb-6 pt-4 rounded-lg ${
            editMode ? `bg-black` : isManager ? `hover:bg-black` : ''
          }`}
          onMouseOver={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
          onFocus={() => ''}
        >
          <div className="w-full flex justify-between mb-4">
            <div className="flex">Details</div>
            {editMode ? (
              <DataStorageInfo />
            ) : hover && isManager ? (
              <div
                className="flex text-sm font-whyte items-center space-x-2 cursor-pointer text-blue-navy"
                onClick={onClick}
              >
                <Image
                  src={`/images/actionIcons/edit-icon.svg`}
                  height={16}
                  width={16}
                />
                <span className="text-base">Edit or add details</span>
              </div>
            ) : null}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {showModal ? (
              <div className="w-full flex flex-col divide-gray-syn6 divider">
                {editMode || companyName ? (
                  <TextField
                    name="companyName"
                    control={control}
                    placeholder="e.g Syndicate, Inc."
                    label="Company name"
                    column={true}
                    borderStyles={borderStyles}
                    borderOutline={false}
                    textAlignment="text-right"
                    paddingStyles="p-4 pr-0"
                    disabled={disabled}
                    required={false}
                  />
                ) : null}

                {editMode || investmentRound ? (
                  <RoundDropDown
                    editMode={editMode}
                    name="investmentRound"
                    label="Round"
                    control={control}
                    borderStyles={borderStyles}
                    disabled={disabled}
                    resetRound={() =>
                      setValue('investmentRound', '', { shouldDirty: true })
                    }
                  />
                ) : null}

                {editMode || numberShares ? (
                  <NumberField
                    name="numberShares"
                    control={control}
                    label="Number of shares"
                    column={true}
                    borderStyles={borderStyles}
                    borderOutline={false}
                    textAlignment="text-right"
                    paddingStyles="p-4 pr-0"
                    placeholder="0"
                    disabled={disabled}
                  />
                ) : null}
                {editMode || numberTokens ? (
                  <NumberField
                    name="numberTokens"
                    control={control}
                    label="Number of tokens"
                    column={true}
                    borderStyles={borderStyles}
                    borderOutline={false}
                    textAlignment="text-right"
                    placeholder="0"
                    disabled={disabled}
                  />
                ) : null}
                {editMode || fullyDilutedOwnershipStake ? (
                  <NumberField
                    name="fullyDilutedOwnershipStake"
                    control={control}
                    addOn="%"
                    addOnStyles="pr-4"
                    column={true}
                    borderStyles={borderStyles}
                    label="Fully diluted ownership stake"
                    borderOutline={false}
                    textAlignment="text-right"
                    placeholder="0"
                    disabled={disabled}
                  />
                ) : null}
                {editMode || investmentDate ? (
                  <ActivityDatePicker
                    control={control}
                    name={'investmentDate'}
                    disabled={disabled}
                    borderStyles={dateBorderStyles}
                    label="Investment date"
                    textAlignment="text-right"
                  />
                ) : null}
                {editMode || currentInvestmentValue ? (
                  <NumberField
                    control={control}
                    name="currentInvestmentValue"
                    label="Current investment value"
                    addOn="USD"
                    addOnStyles="pr-10"
                    column={true}
                    borderStyles={borderStyles}
                    borderOutline={false}
                    textAlignment="text-right"
                    placeholder="0"
                    disabled={disabled}
                  />
                ) : null}
                {editMode || costBasis ? (
                  <NumberField
                    name="costBasis"
                    addOn="USD"
                    addOnStyles="pr-10"
                    label="Cost basis"
                    control={control}
                    column={true}
                    borderStyles={borderStyles}
                    borderOutline={false}
                    textAlignment="text-right"
                    placeholder="0"
                    disabled={disabled}
                  />
                ) : null}
              </div>
            ) : null}
            {editMode ? (
              <div>
                <PiiWarning />
                <div className="w-full pt-6 bg-black">
                  <button
                    className="w-full rounded-lg text-base px-8 py-4 bg-white text-black"
                    type="submit"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      ) : null}
    </>
  );
};

export default InvestmentDetailsModal;
