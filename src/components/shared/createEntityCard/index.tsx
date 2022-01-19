import React from "react";

const CreateEntityCard: React.FC = () => {
  return (
    <a
      href="https://syndicatedao.gitbook.io/syndicate-wiki/web3-investment-clubs/create-a-legal-entity/form-your-legal-entity"
      target="_blank"
      rel="noreferrer"
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
