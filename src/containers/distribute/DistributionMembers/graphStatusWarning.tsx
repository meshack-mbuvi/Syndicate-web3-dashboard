import { CtaButton } from '@/components/CTAButton';
import { B2, B3 } from '@/components/typography';
import Image from 'next/image';

interface Props {
  titleWarningText: string;
  content: string;
  onClick: () => void;
}

/**
 * @dev This component is used to display a warning/disclaimer message when data
 * from the graph is stale and there is a risk to members/users if the current
 * action is performed.
 *
 * @param {string} titleWarningText Text to display as a warning.
 * @param {string} content gives more context to the implications of the current
 * state of the data.
 */
export const GraphStatusWarningModal: React.FC<Props> = ({
  titleWarningText,
  content,
  onClick
}: Props) => {
  return (
    <div className="absolute m-auto left-0 right-0 top-20 bottom-0">
      <div className="flex justify-center h-full">
        <div className="flex m-auto align-middle content-center my-auto px-4 flex-col w-fit-content max-w-480">
          <div className="mb-4 space-x-2 font-light flex justify-center">
            <Image src="/images/warning.svg" alt="" width={16} height={16} />
            <B2 extraClasses="text-center" weightClassOverride="font-light">
              {titleWarningText}
            </B2>
          </div>

          <B3
            extraClasses="text-center text-gray-syn3"
            weightClassOverride="font-light"
          >
            {content}
          </B3>
          <div className="mb-10 mx-8 mt-6">
            <CtaButton onClick={onClick}>Acknowledge and continue</CtaButton>
          </div>
        </div>
      </div>
    </div>
  );
};
