import { InputFieldCreateToken } from '@/components/inputs/create/InputFieldCreateToken';
import { CreateFlowStepTemplate } from '..';

interface Props {
  tokenSymbol: string;
  handleTokenSymbolChange: (newTokenSymbol: string) => void;
}

export const DealsCreateParticipation: React.FC<Props> = ({
  tokenSymbol,
  handleTokenSymbolChange
}) => {
  return (
    <CreateFlowStepTemplate
      title="Create participation token"
      activeInputIndex={0}
      inputs={[
        {
          input: (
            <InputFieldCreateToken
              tokenSymbolValue={tokenSymbol}
              handleTokenSymbolChange={handleTokenSymbolChange}
            />
          ),
          label: 'Token symbol',
          info: 'This is the symbol of the non-tranferable token that will be distributed proportionally to those who you accept into the deal when you execute. Learn more'
        }
      ]}
    />
  );
};
