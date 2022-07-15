import { H4 } from '@/components/typography';
import React from 'react';

export enum createHeader {
  DESIGN = 'DESIGN',
  CUSTOMIZE = 'CUSTOMIZE',
  REVIEW = 'REVIEW'
}

interface Props {
  screen?: createHeader;
}

export const CreateCollectiveTitle: React.FC<Props> = ({ screen }) => {
  return (
    <div className="w-full mb-6">
      <H4>
        {screen === createHeader.DESIGN && `Design your collective’s NFT`}
        {screen === createHeader.CUSTOMIZE && `Customize your collective`}
        {screen === createHeader.REVIEW && `Review`}
      </H4>
    </div>
  );
};
