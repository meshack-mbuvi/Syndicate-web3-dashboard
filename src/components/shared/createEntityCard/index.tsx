import React from "react";

const CreateEntityCard: React.FC = () => {
  return (
    <a
      href="https://syndicatedao.gitbook.io/syndicate-wiki/web3-investment-clubs/create-a-legal-entity/form-your-legal-entity"
      target="_blank"
      rel="noreferrer"
    >
      <div className="bg-gray-syn8 hover:bg-gray-syn7 duration-500 transition-all rounded-2-half my-6 px-8 py-6 flex items-stretch items-start">
        <div className="flex-shrink-0">
          <img src="/images/ribbon.svg" className="mt-1" alt="ribbon" />
        </div>
        <div className="ml-4">
          <div className="text-base leading-6">
            Create an off-chain legal entity
          </div>
          <p className="text-sm leading-6 text-gray-syn4 mt-1">
            Syndicate can help with basic formation, filings, and legal document
            templates{" "}
          </p>
        </div>
        <img src="/images/chevron-right-dark.svg" className="mt-1 flex-shrink-0 ml-3" alt="chevron" />
      </div>
    </a>
  );
};

export default CreateEntityCard;
