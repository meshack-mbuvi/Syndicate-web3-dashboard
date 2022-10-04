/* eslint-disable jsx-a11y/anchor-is-valid */
import { useDemoMode } from '@/hooks/useDemoMode';
import React from 'react';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { CREATE_LEGAL_ENTITY_CLICK } from '@/components/amplitude/eventNames';

const CreateEntityCard: React.FC = () => {
  const isDemoMode = useDemoMode();
  const DOOLA_LINK = 'https://doolahq.typeform.com/syndicate-197';

  return (
    <a
      href={isDemoMode ? undefined : DOOLA_LINK}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        amplitudeLogger(CREATE_LEGAL_ENTITY_CLICK, { flow: Flow.CLUB_LEGAL });
      }}
    >
      <div className="rounded-t-2xl space-x-4 flex items-stretch">
        <div className="flex-shrink-0">
          <img src="/images/ribbon.svg" className="mt-1" alt="ribbon" />
        </div>
        <div className="space-y-1">
          <p className="text-base leading-6">
            Create an off-chain legal entity
          </p>
          <p className="text-sm leading-6 text-gray-syn4">
            Syndicate can help with basic formation, filings, and legal document
            templates. <span className="text-blue">Learn more</span>
          </p>
        </div>
      </div>
    </a>
  );
};

export default CreateEntityCard;
