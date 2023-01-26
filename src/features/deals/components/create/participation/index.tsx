import { InputFieldCreateToken } from '@/components/inputs/create/InputFieldCreateToken';
import { useCreateDealContext } from '@/context/createDealContext';
import { CreateFlowStepTemplate } from '@/templates/createFlowStepTemplate';

interface Props {
  tokenSymbol: string;
  handleTokenSymbolChange?: (newTokenSymbol: string) => void;
}

export const DealsCreateParticipation: React.FC<Props> = ({
  tokenSymbol,
  handleTokenSymbolChange
}) => {
  const { handleNext, isNextButtonDisabled, showNextButton } =
    useCreateDealContext();

  return (
    <CreateFlowStepTemplate
      title="Create participation token"
      activeInputIndex={0}
      handleNext={handleNext}
      isNextButtonDisabled={isNextButtonDisabled ?? false}
      showNextButton={showNextButton ?? false}
      inputs={[
        {
          input: (
            <InputFieldCreateToken
              tokenSymbolValue={tokenSymbol}
              handleTokenSymbolChange={handleTokenSymbolChange}
            />
          ),
          label: 'Token symbol',
          info: 'This is the symbol of the non-transferable token that will be distributed proportionally to those who you accept into the deal when you execute.'
        }
      ]}
    />
  );
};
