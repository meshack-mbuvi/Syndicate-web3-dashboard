import React from 'react';
import { B3, H2 } from '@/components/typography';

/**
 * @name InactiveDealCard
 * @description A card that displays when a deal is inactive(dissolved or executed).
 * @returns {React.FC}
 * @example <InactiveDealCard />
 */
export const InactiveDealCard: React.FC<{
  isDealDissolved: boolean;
  dealName: string;
}> = ({ isDealDissolved = false, dealName }) => {
  return (
    <div className="rounded-2.5xl bg-gray-syn8 p-8 space-y-2">
      <B3 extraClasses="text-gray-syn4">Inactive deal</B3>
      <H2 extraClasses="text-white">{dealName}</H2>
      <div className="p-4 rounded-1.5lg bg-gray-syn7">
        <B3 extraClasses="text-white">
          {isDealDissolved ? 'Deal was dissolved' : 'Deal has been concluded'}
        </B3>
      </div>
    </div>
  );
};
