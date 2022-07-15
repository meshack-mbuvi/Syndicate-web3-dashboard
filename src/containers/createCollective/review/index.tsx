import React, { FC } from 'react';
import { CollectiveFormReview } from '@/components/collectives/create/review';
import { TimeWindow } from '@/components/collectives/create/inputs/timeWindow';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { CreateCollectiveTitle, createHeader } from '../shared';
import { CollectivesInteractiveBackground } from '@/components/collectives/interactiveBackground';
import EstimateGas from '@/containers/createInvestmentClub/gettingStarted/estimateGas';
import { Callout } from '@/components/callout';

interface Props {
  handleNext: (e) => void;
}
const CreateCollectiveReview: FC<Props> = ({ handleNext }) => {
  return (
    <div>
      <CreateCollectiveTitle screen={createHeader.REVIEW} />
      <div className="mt-8">
        <CollectiveFormReview
          nameValue={''}
          handleNameChange={() => {}}
          tokenSymbolValue={''}
          handleTokenSymbolChange={() => {}}
          priceToJoin={1000}
          handlePriceToJoinChange={() => {}}
          tokenDetails={{ symbol: '', icon: '' }}
          handleClickToChangeToken={() => {}}
          maxPerWallet={10}
          handleMaxPerWalletChange={() => {}}
          openUntil={OpenUntil.FUTURE_DATE}
          setOpenUntil={() => {}}
          closeDate={new Date('10/10/2022')}
          handleCloseDateChange={() => {}}
          closeTime={'234234'}
          handleCloseTimeChange={() => {}}
          selectedTimeWindow={TimeWindow.DAY}
          handleTimeWindowChange={() => {}}
          endOfTimeWindow={'Jun 11, 2021 11:59pm PST'}
          allowOwnershipTransfer={true}
          handleChangeAllowOwnershipTransfer={() => {}}
        />
        <div className="flex flex-col xl:flex-row space-x-0 xl:space-x-6 space-y-6 xl:space-y-0">
          {/* Gas fees */}
          <div className="flex-grow">
            <Callout>
              <EstimateGas customClasses="bg-opacity-20 rounded-custom w-full flex cursor-default items-center" />
            </Callout>
          </div>

          {/* Submit button */}
          <button
            onClick={handleNext}
            className={`green-CTA transition-all duration-700 w-full lg:w-auto`}
          >
            Launch
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectiveReview;

export const ReviewRightPanel: React.FC = () => {
  return (
    <div className="bg-black w-full h-full pb-38">
      <CollectivesInteractiveBackground
        heightClass="h-full"
        widthClass="w-full"
        floatingIcon="https://lh3.googleusercontent.com/kGd5K1UPnRVe2k_3na9U5IKsAKr2ERGHn6iSQwQBPGywEMcRWiKtFmUh85nuG0tBPKLVqaXsWqHKCEJidwa2w4oUgcITcJ7Kh-ObsA"
        numberOfParticles={40}
      />
    </div>
  );
};
