import { CollapsibleTable } from '@/components/collapsibleTable';
import { EditRowIndex } from '@/state/modifyCollectiveSettings/types';
import { useEffect, useState } from 'react';
import RemixLink from '../shared/RemixLink';
import Image from 'next/image';
import useFeatureFlag from '@/hooks/useFeatureFlag';
import { FEATURE_FLAGS } from '@/pages/_app';

interface RemixAdminTableProps {
  activeRow: number;
  setActiveRow: (rowIdx: EditRowIndex) => void;
  contractAddress: string;
}

export const RemixAdminTable: React.FC<RemixAdminTableProps> = ({
  activeRow,
  setActiveRow,
  contractAddress
}: RemixAdminTableProps) => {
  const [isRemixEnabled, setRemixEnabled] = useState<boolean>(
    localStorage.getItem(`${contractAddress}-adminEnabledRemix`) === 'true'
  );

  const { isReady, isTreatmentOn: isRemixTreatmentOn } = useFeatureFlag(
    FEATURE_FLAGS.REMIX,
    {
      remixAllowlisted: true
    }
  );

  useEffect(() => {
    localStorage.setItem(
      `${contractAddress}-adminEnabledRemix`,
      JSON.stringify(isRemixEnabled)
    );
  }, [contractAddress, isRemixEnabled]);

  return (
    <>
      {isReady && isRemixTreatmentOn && (
        <CollapsibleTable
          title={
            <div className="mb-5">
              <Image
                src={'/images/remix/remix-gradient.svg'}
                height={20}
                width={97}
              />
            </div>
          }
          subtitle="Display custom modules in the Syndicate interface."
          rows={[]}
          expander={{
            isExpanded: isRemixEnabled,
            setIsExpanded: setRemixEnabled
          }}
          switchRowIndex={EditRowIndex.Remix}
          activeRow={activeRow}
          setActiveRow={setActiveRow}
          isTableHighlightingActive={false}
          topRowDetails={
            <RemixLink
              text="Learn more about Remix"
              // TODO [REMIX][DOCS]: [PRO2-89] add link to remix docs
              link="https://guide.syndicate.io/en/developer-platform/start-here"
              extraClasses="mt-1 pt-2"
            />
          }
        />
      )}
    </>
  );
};
