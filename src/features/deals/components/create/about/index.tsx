import { ShuffleIcon } from '@/components/icons/shuffle';
import { InputFieldWithAddOn } from '@/components/inputs/inputFieldWithAddOn';
import { useCreateDealContext } from '@/context/createDealContext';
import {
  CreateFlowStepTemplate,
  CreateFlowStepTemplateIconType
} from '@/templates/createFlowStepTemplate';
// import { TextArea } from '@/components/inputs/simpleTextArea';
import { useState } from 'react';

interface Props {
  name?: string;
  nameError?: string;
  handleNameChange?: (name: string) => void;
  handleShuffle?: (e: any) => void;
  // details?: string;
  // detailsError?: string;
  // handleDetailsChange?: (details: string) => void;
}

enum SelectedInput {
  TITLE = 0
  // DETAILS = 1
}

export const DealsCreateAbout: React.FC<Props> = ({
  name,
  nameError,
  handleNameChange,
  handleShuffle
  // details,
  // detailsError,
  // handleDetailsChange
}) => {
  const [activeInputIndex, setActiveInput] = useState<SelectedInput | null>(
    null
  );

  const { handleNext, isNextButtonDisabled, showNextButton } =
    useCreateDealContext();
  return (
    <CreateFlowStepTemplate
      title="What’s this deal about?"
      activeInputIndex={activeInputIndex}
      handleNext={handleNext}
      isNextButtonDisabled={isNextButtonDisabled ?? false}
      showNextButton={showNextButton ?? false}
      inputs={[
        {
          input: (
            <InputFieldWithAddOn
              value={name}
              onChange={(e): void => {
                if (handleNameChange) handleNameChange(e.target.value);
              }}
              addOn={
                <div className="rounded-full px-4 py-1.5 text-black bg-white hover:bg-gray-syn2 active:bg-gray-syn3">
                  <ShuffleIcon />
                </div>
              }
              addOnOnClick={(e?: React.MouseEvent<HTMLElement>): void => {
                if (handleShuffle) handleShuffle(e);
              }}
              placeholderLabel="Name your deal"
              onFocus={(): void => {
                setActiveInput(SelectedInput.TITLE);
              }}
              isInErrorState={nameError ? true : false}
              infoLabel={nameError ? nameError : ''}
            />
          ),
          label: 'Deal title',
          info: 'Your deal’s name is stored on-chain, so it’s publicly visible. If you’d prefer to obfuscate this deal, generate a random name.',
          iconType: CreateFlowStepTemplateIconType.EYE_OPEN
        } /* ,
        {
          input: (
            <TextArea
              value={details ? details : ''}
              handleValueChange={handleDetailsChange}
              widthClass="w-full"
              placeholderLabel="Give prospective participants as much information as possible to help them understand this deal. Feel free to put links here as well to documents or websites that they may want to look at. This information will be public to anyone who views this page."
              onFocus={() => {
                setActiveInput(SelectedInput.DETAILS);
              }}
              isInErrorState={detailsError ? true : false}
              helperText={detailsError ? detailsError : undefined}
            />
          ),
          label: 'Details',
          info: 'Describe what this and what a participant needs to know to get more information if needed. This information is to inform potnetial participants and will be public to all viewers.'
        } */
      ]}
    />
  );
};
