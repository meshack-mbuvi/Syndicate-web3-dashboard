import { amplitudeLogger, Flow } from '@/components/amplitude';
import { RANDOMIZE_NAME_CLICK } from '@/components/amplitude/eventNames';
import { ShuffleIcon } from '@/components/icons/shuffle';
import { InputWithLeadingAddon } from '@/components/inputs';
import { InputFieldWithAddOn } from '@/components/inputs/inputFieldWithAddOn';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { useDebounce } from '@/hooks/useDebounce';
import { AppState } from '@/state';
import {
  setInvestmentClubName,
  setInvestmentClubSymbolPlaceHolder
} from '@/state/createInvestmentClub/slice';
import {
  CreateFlowStepTemplate,
  CreateFlowStepTemplateIconType
} from '@/templates/createFlowStepTemplate';
import { acronymGenerator } from '@/utils/acronymGenerator';
import { handleRandomizer } from '@/utils/randomizer';
import { symbolValidation } from '@/utils/validators';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ClubNameSelector: React.FC<{
  isReview?: boolean;
  editButtonClicked?: boolean;
}> = ({ isReview }) => {
  const {
    createInvestmentClubSliceReducer: {
      investmentClubName,
      investmentClubSymbolPlaceHolder
    }
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const { handleNext, editingStep } = useCreateInvestmentClubContext();

  const [errors, setErrors] = useState('');
  const [hasSymbolBeenEdited, setSymbolEditState] = useState(false);
  const [activeInputIndex, setActiveInputIndex] = useState(0);

  const debouncedSymbol = useDebounce(investmentClubName, 500);

  useEffect(() => {
    if (debouncedSymbol && !hasSymbolBeenEdited) {
      dispatch(
        setInvestmentClubSymbolPlaceHolder(acronymGenerator(debouncedSymbol))
      );
    } else if (!debouncedSymbol && !hasSymbolBeenEdited) {
      dispatch(setInvestmentClubSymbolPlaceHolder(''));
    }
  }, [debouncedSymbol, dispatch, hasSymbolBeenEdited]);

  useEffect(() => {
    // Dismiss error message after 1 second
    if (errors) {
      setTimeout(() => {
        setErrors('');
      }, 2000);
    }
  }, [errors]);

  const handleSymbolChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const _sym = (e.target.value as string).trim().toUpperCase();
    const { validSym, errorMsg } = symbolValidation(_sym);
    dispatch(setInvestmentClubSymbolPlaceHolder(validSym));
    setErrors(errorMsg); // It will default to empty string if no errors

    // This ensure we don't override what the user typed with our auto generated abbreviation
    setSymbolEditState(true);
    if (!_sym.length) {
      setSymbolEditState(false);
    }
  };

  const randomize = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();

    const slug = handleRandomizer();
    void amplitudeLogger(RANDOMIZE_NAME_CLICK, {
      flow: Flow.CLUB_CREATE
    });

    dispatch(setInvestmentClubName(slug));
  };

  return (
    <div className={`${editingStep ? 'pt-11' : ''}`}>
      {isReview ? (
        <>
          <div className="mb-8">
            <InputFieldWithAddOn
              value={investmentClubName}
              onChange={(e): void => {
                dispatch(setInvestmentClubName(e.target.value));
              }}
              addOn={
                <div className="rounded-full px-4 py-1.5 text-black bg-white hover:bg-gray-syn2 active:bg-gray-syn3">
                  <ShuffleIcon />
                </div>
              }
              addOnOnClick={(e: React.MouseEvent<HTMLElement>): void => {
                randomize(e);
              }}
              placeholderLabel="Name (e.g. Alpha DAO)"
              isInErrorState={false}
              infoLabel={''}
            />
          </div>

          <InputWithLeadingAddon
            label=""
            addon="✺"
            value={investmentClubSymbolPlaceHolder}
            onChange={handleSymbolChange}
            isInErrorState={errors ? true : false}
            error={errors}
            placeholder="ABC"
            infoLabel="This token name should be readily recognizable. Members receive this token as proof of their deposit."
          />
        </>
      ) : (
        <CreateFlowStepTemplate
          hideCallouts={false}
          title={'Start an investment club'}
          activeInputIndex={activeInputIndex}
          showNextButton={true}
          isNextButtonDisabled={false}
          handleNext={handleNext}
          calloutIcon={<img src="/images/eye-open-white.svg" alt="Preview" />}
          inputs={[
            {
              input: (
                <InputFieldWithAddOn
                  value={investmentClubName}
                  onChange={(e): void => {
                    dispatch(setInvestmentClubName(e.target.value));
                  }}
                  addOn={
                    <div className="rounded-full px-4 py-1.5 text-black bg-white hover:bg-gray-syn2 active:bg-gray-syn3">
                      <ShuffleIcon />
                    </div>
                  }
                  addOnOnClick={(e: React.MouseEvent<HTMLElement>): void => {
                    randomize(e);
                  }}
                  placeholderLabel="Name (e.g. Alpha DAO)"
                  isInErrorState={false}
                  infoLabel={''}
                  onFocus={(): void => {
                    setActiveInputIndex(0);
                  }}
                />
              ),
              iconType: CreateFlowStepTemplateIconType.EYE_OPEN,
              label: 'Club name',
              info: 'Your club’s name is stored on-chain, so it’s publicly visible. If you’d prefer to be anonymous, generate a random name.'
            },
            {
              input: (
                <InputWithLeadingAddon
                  label=""
                  addon="✺"
                  value={investmentClubSymbolPlaceHolder}
                  onChange={handleSymbolChange}
                  isInErrorState={errors ? true : false}
                  error={errors}
                  onFocus={(): void => {
                    setActiveInputIndex(1);
                  }}
                  placeholder="ABC"
                  infoLabel="This token name should be readily recognizable. Members receive this token as proof of their deposit."
                />
              ),
              label: 'Club token',
              info: `Set an easily recognizable symbol for your investment club token that powers the club's cap table management and governance infrastructure. Members receive this investment club token (initially defaults to non-transferable) as proof of their deposit.`
            }
          ]}
        />
      )}
    </div>
  );
};

export default ClubNameSelector;
