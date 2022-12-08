/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { NumberField, TextField } from '@/components/inputs';
import ActivityDatePicker from '@/containers/layoutWithSyndicateDetails/activity/shared/ActivityDatePicker';
import { DataStorageInfo } from '@/containers/layoutWithSyndicateDetails/activity/shared/DataStorageInfo';
import RoundDropDown from '@/containers/layoutWithSyndicateDetails/activity/shared/InvestmentDetails/InvestmentDetails/RoundDropDown';
import PiiWarning from '@/containers/layoutWithSyndicateDetails/activity/shared/PiiWarning';
import { ANNOTATE_TRANSACTIONS } from '@/graphql/mutations';
import { getInput } from '@/hooks/useLegacyTransactions';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import {
  CurrentTransaction,
  SyndicateDetailsAnnotation
} from '@/state/erc20transactions/types';
import { useMutation } from '@apollo/client';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

export interface Details {
  companyName: string;
  postMoneyValuation: string;
  preMoneyValuation: string;
  acquisitionDate: Date;
  roundCategory: string;
  equityStake: string;
  sharesAmount: string;
  tokenAmount: string;
}

export const EmptyDetails = {
  companyName: '',
  postMoneyValuation: '',
  preMoneyValuation: '',
  acquisitionDate: new Date(0),
  roundCategory: '',
  equityStake: '',
  sharesAmount: '',
  tokenAmount: ''
};

interface IInvestmentDetailsModal {
  showModal: boolean;
  readonly: boolean;
  editMode: boolean;
  onClick: (e: any) => void;
  currentTransaction: CurrentTransaction;
  setCurrentTransaction: Dispatch<SetStateAction<CurrentTransaction>>;
  storedInvestmentDetails: Details;
  transactionId: string;
  setStoredInvestmentDetails: (details: Details) => void;
  isManager: boolean;
  blockTimestamp: number;
  onSuccessfulAnnotation: () => void;
}

const InvestmentDetailsModal: React.FC<IInvestmentDetailsModal> = ({
  showModal,
  editMode,
  onClick,
  currentTransaction,
  setCurrentTransaction,
  storedInvestmentDetails,
  transactionId,
  setStoredInvestmentDetails,
  isManager,
  blockTimestamp,
  onSuccessfulAnnotation
}) => {
  const disabled = !editMode;
  const [hover, setHover] = useState<boolean>(false);

  const { annotation } = currentTransaction;

  const {
    web3Reducer: {
      web3: { activeNetwork, account }
    },
    erc20TokenSliceReducer: { erc20Token }
  } = useSelector((state: AppState) => state);

  const setHoverState = (over: any) => {
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
    if (!storedInvestmentDetails?.acquisitionDate) {
      //  Set the date to the current block timestamp
      setValue('acquisitionDate', new Date());
    }
  }, [blockTimestamp, storedInvestmentDetails?.acquisitionDate]);

  // Annotation
  const [annotationMutation, { data }] = useMutation(ANNOTATE_TRANSACTIONS);

  const formValues = getValues();
  const {
    companyName,
    postMoneyValuation,
    preMoneyValuation,
    acquisitionDate,
    roundCategory,
    equityStake,
    sharesAmount,
    tokenAmount
  } = formValues;

  useEffect(() => {
    if (data?.legacyAnnotateTransactions) {
      onSuccessfulAnnotation();
    }
  }, [data?.legacyAnnotateTransactions]);

  const onSubmit = (values: Details): void => {
    // fields without values will be sent to the backend as an empty string
    // this makes it possible to remove a previously set value.
    const detailsAnnotationData: SyndicateDetailsAnnotation = {
      acquisitionDate: values.acquisitionDate,
      annotationMetadata: annotation.annotationMetadata,
      companyName: values.companyName,
      equityStake: values.equityStake,
      fromLabel: annotation.fromLabel,
      memo: annotation.memo,
      postMoneyValuation: values.postMoneyValuation,
      preMoneyValuation: values.preMoneyValuation,
      roundCategory: values.roundCategory,
      sharesAmount: values.sharesAmount,
      toLabel: annotation.toLabel,
      tokenAmount: values.tokenAmount,
      transactionCategory: annotation.transactionCategory,
      transactionId: transactionId
    };

    setCurrentTransaction({
      ...currentTransaction,
      annotation: detailsAnnotationData
    });

    annotationMutation({
      variables: {
        transactionAnnotationList: [{ ...detailsAnnotationData }],
        chainId: activeNetwork.chainId,
        input: getInput(`${erc20Token.address}:${account}`)
      },
      context: {
        clientName: SUPPORTED_GRAPHS.BACKEND,
        chainId: activeNetwork.chainId
      }
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
          onMouseOver={(): void => setHoverState(true)}
          onMouseLeave={(): void => setHoverState(false)}
          onFocus={(): string => ''}
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
          {showModal ? (
            <form onSubmit={handleSubmit(onSubmit)}>
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

                {editMode || roundCategory ? (
                  <RoundDropDown
                    editMode={editMode}
                    name="roundCategory"
                    label="Round"
                    control={control}
                    borderStyles={borderStyles}
                    disabled={disabled}
                    defaultValue={roundCategory}
                    resetRound={(): void => {
                      setValue('roundCategory', '', { shouldDirty: true });
                    }}
                  />
                ) : null}

                {editMode || sharesAmount ? (
                  <NumberField
                    name="sharesAmount"
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
                {editMode || tokenAmount ? (
                  <NumberField
                    name="tokenAmount"
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
                {editMode || equityStake ? (
                  <NumberField
                    name="equityStake"
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
                {editMode || acquisitionDate ? (
                  <ActivityDatePicker
                    control={control}
                    name={'acquisitionDate'}
                    disabled={disabled}
                    borderStyles={dateBorderStyles}
                    label="Investment date"
                    textAlignment="text-right"
                  />
                ) : null}
                {editMode || preMoneyValuation ? (
                  <NumberField
                    control={control}
                    name="preMoneyValuation"
                    label="Pre-money valuation"
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
                {editMode || postMoneyValuation ? (
                  <NumberField
                    name="postMoneyValuation"
                    addOn="USD"
                    addOnStyles="pr-10"
                    label="Post-money valuation"
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
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default InvestmentDetailsModal;
