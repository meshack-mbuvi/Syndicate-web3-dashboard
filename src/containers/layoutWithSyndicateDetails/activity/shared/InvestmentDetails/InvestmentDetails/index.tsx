import { NumberField, TextField } from "@/components/inputs";
import ActivityDatePicker from "@/containers/layoutWithSyndicateDetails/activity/shared/ActivityDatePicker";
import RoundDropDown from "@/containers/layoutWithSyndicateDetails/activity/shared/InvestmentDetails/InvestmentDetails/RoundDropDown";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PiiWarning from "@/containers/layoutWithSyndicateDetails/activity/shared/PiiWarning";
import { ANNOTATE_TRANSACTIONS } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { DataStorageInfo } from "@/containers/layoutWithSyndicateDetails/activity/shared/DataStorageInfo";
import { investmentRounds } from "../InvestmentDetailsConstants";
import { isEmpty, isEqual } from "lodash";
import { AppState } from "@/state";
import { useSelector } from "react-redux";

interface Details {
  companyName: string;
  costBasis: string;
  currentInvestmentValue: string;
  investmentDate: string;
  investmentRound: string;
  ownershipStake: string;
  shareAmount: string;
  tokenAmount: string;
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
}

const InvestmentDetailsModal: React.FC<IInvestmentDetailsModal> = ({
  showModal,
  editMode,
  onClick,
  storedInvestmentDetails,
  transactionId,
  setStoredInvestmentDetails,
  isManager,
}) => {
  const disabled = !editMode;
  const [hover, setHover] = useState<boolean>(false);

  const {
    transactionsReducer: {
      currentTransaction: { blockTimestamp },
    },
  } = useSelector((state: AppState) => state);

  const setHoverState = (over) => {
    if (!editMode && over) {
      setHover(true);
    } else {
      setHover(false);
    }
  };

  const {
    watch,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isDirty, dirtyFields },
  } = useForm<Details>({
    mode: "onChange",
    defaultValues: storedInvestmentDetails,
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
      setValue("investmentDate", new Date(blockTimestamp * 1000).toISOString());
    }
  }, [blockTimestamp, storedInvestmentDetails?.investmentDate]);

  // Annotation
  const [
    annotationMutation,
    { data: annotationData, loading: annotationLoading, error: err },
  ] = useMutation(ANNOTATE_TRANSACTIONS);

  const formValues = getValues();
  const {
    companyName,
    costBasis,
    currentInvestmentValue,
    investmentDate,
    investmentRound,
    ownershipStake,
    shareAmount,
    tokenAmount,
  } = formValues;

  const onSubmit = (values) => {
    const newObj = {
      transactionId: transactionId,
      ...(values.companyName && {
        companyName: values.companyName,
      }),
      ...(values?.costBasis && {
        postMoneyValuation: values?.costBasis,
      }),
      ...(values?.currentInvestmentValue && {
        preMoneyValuation: values?.currentInvestmentValue,
      }),
      ...(values?.investmentDate && {
        acquisitionDate: new Date(values?.investmentDate).toISOString(),
      }),
      ...(values?.ownershipStake && {
        equityStake: values?.ownershipStake,
      }),
      ...(values?.tokenAmount && {
        tokenAmount: values?.tokenAmount,
      }),
      ...(values?.shareAmount && {
        sharesAmount: values?.shareAmount,
      }),
      ...(values?.investmentRound && {
        roundCategory: investmentRounds.find(
          (round) => round.text === values?.investmentRound,
        )?.value,
      }),
    };

    annotationMutation({
      variables: {
        transactionAnnotationList: [{ ...newObj }],
      },
      context: { clientName: "backend" },
    });
    setStoredInvestmentDetails(values);
    reset(values, {
      keepValues: true,
    });
    onClick(values);
  };

  const borderStyles =
    "border-b-1 border-gray-syn6 border-collapse text-gray-syn4";
  const dateBorderStyles =
    "w-full border-b-1 border-gray-syn6 border-collapse text-gray-syn4 flex-row";
  const details = Object.values(formValues);
  return (
    <>
      {editMode || details.join("").length ? (
        <div
          className={`border border-none p-5 rounded-lg mt-4 mb-6 ${
            editMode ? `bg-black` : isManager ? `hover:bg-black` : ""
          }`}
          onMouseOver={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
          onFocus={() => ""}
        >
          <div className="w-full flex justify-between">
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
                  />
                ) : null}

                {editMode || shareAmount ? (
                  <NumberField
                    name="shareAmount"
                    control={control}
                    label="Amount of shares"
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
                    label="Amount of tokens"
                    column={true}
                    borderStyles={borderStyles}
                    borderOutline={false}
                    textAlignment="text-right"
                    placeholder="0"
                    disabled={disabled}
                  />
                ) : null}
                {editMode || ownershipStake ? (
                  <NumberField
                    name="ownershipStake"
                    control={control}
                    addOn="%"
                    addOnStyles="pr-4"
                    column={true}
                    borderStyles={borderStyles}
                    label="Ownership stake"
                    borderOutline={false}
                    textAlignment="text-right"
                    placeholder="0"
                    disabled={disabled}
                  />
                ) : null}
                {editMode || investmentDate ? (
                  <ActivityDatePicker
                    control={control}
                    name={"investmentDate"}
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
                <div className="w-full py-6 w-full pb-5 bg-black">
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
