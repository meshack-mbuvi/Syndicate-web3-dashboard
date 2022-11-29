import { ShuffleIcon } from '@/components/icons/shuffle';
import { InputFieldWithAddOn } from '@/components/inputs/inputFieldWithAddOn';
import { TextArea } from '@/components/inputs/simpleTextArea';
import { useState } from 'react';
import { CreateFlowStepTemplate } from '..';

interface Props {
  title: string;
  titleError?: string;
  handleTitleChange: (newTitle: string) => void;
  handleShuffle: () => void;
  details: string;
  detailsError?: string;
  handleDetailsChange: (newDetails: string) => void;
}

enum SelectedInput {
  TITLE = 0,
  DETAILS = 1
}

export const DealsCreateAbout: React.FC<Props> = ({
  title,
  titleError,
  handleTitleChange,
  handleShuffle,
  details,
  detailsError,
  handleDetailsChange
}) => {
  const [activeInputIndex, setActiveInput] = useState<SelectedInput | null>(
    null
  );
  return (
    <CreateFlowStepTemplate
      title="What’s this deal about?"
      activeInputIndex={activeInputIndex}
      inputs={[
        {
          input: (
            <InputFieldWithAddOn
              value={title}
              onChange={(e) => {
                handleTitleChange(e.target.value);
              }}
              addOn={
                <div className="rounded-full px-4 py-1.5 text-black bg-white hover:bg-gray-syn2 active:bg-gray-syn3">
                  <ShuffleIcon />
                </div>
              }
              addOnOnClick={() => {
                handleShuffle();
              }}
              placeholderLabel="Name your deal"
              onFocus={() => {
                setActiveInput(SelectedInput.TITLE);
              }}
              isInErrorState={titleError ? true : false}
              infoLabel={titleError ? titleError : null}
            />
          ),
          label: 'Deal title',
          info: 'Your deal’s name is stored on-chain, so it’s publicly visible. If you’d prefer to obfuscate this deal, generate a random name.'
        },
        {
          input: (
            <TextArea
              value={details}
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
        }
      ]}
    />
  );
};
