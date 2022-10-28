import { CollapsibleTable } from '@/components/collapsibleTable';
import { EditRowIndex } from '@/state/modifyCollectiveSettings/types';
import { useEffect, useState } from 'react';
import RemixLink from './RemixLink';

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

  useEffect(() => {
    //TODO [REMIX]: handle try catch conversion
    localStorage.setItem(
      `${contractAddress}-adminEnabledRemix`,
      JSON.stringify(isRemixEnabled)
    );
  }, [contractAddress, isRemixEnabled]);

  return (
    <CollapsibleTable
      title="Display Remix"
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
          // TODO [DOCS] : add link to remix docs
          link="https://guide.syndicate.io/en/developer-platform/start-here"
          extraClasses="mt-1 pt-2"
        />
      }
    />
  );
};
