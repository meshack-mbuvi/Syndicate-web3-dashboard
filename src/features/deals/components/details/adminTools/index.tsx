import { CTAButton, CTAStyle } from '@/components/CTAButton';
import { L2 } from '@/components/typography';

interface Props {
  hideExecuteButton: boolean;
  handleExecuteDealClick: () => void;
  handleDissolveDealClick: () => void;
  disableDissolveButton?: boolean;
  disableExecuteButton?: boolean;
}

const DealDetailsAdminTools: React.FC<Props> = ({
  hideExecuteButton,
  handleExecuteDealClick,
  handleDissolveDealClick,
  disableDissolveButton = false,
  disableExecuteButton = false
}) => {
  return (
    <div className="bg-gray-syn8 rounded-2.5xl py-6 px-8">
      <L2 extraClasses="mb-6">Admin tools</L2>
      <div className="space-y-4">
        {!hideExecuteButton && (
          <CTAButton
            fullWidth
            onClick={handleExecuteDealClick}
            disabled={disableExecuteButton}
          >
            Execute deal
          </CTAButton>
        )}
        <CTAButton
          style={CTAStyle.DARK_OUTLINED}
          fullWidth
          onClick={handleDissolveDealClick}
          disabled={disableDissolveButton}
        >
          Dissolve deal
        </CTAButton>
      </div>
    </div>
  );
};

export default DealDetailsAdminTools;
