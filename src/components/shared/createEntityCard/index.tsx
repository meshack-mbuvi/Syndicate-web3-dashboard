import React from "react";

const CreateEntityCard = () => {
  return (
    <a
      href="https://syndicatedao.gitbook.io/syndicate-wiki/web3-investment-clubs/create-a-legal-entity/form-your-legal-entity"
      target="_blank"
    >
      <div className="bg-gray-syn8 rounded-2xl my-6 px-8 py-6 flex items-start">
        <img src="/images/ribbon.svg" className="mt-1" />
        <div className="ml-4">
          <div className="text-base leading-6">
            Create an off-chain legal entity
          </div>
          <p className="text-sm leading-6 text-gray-syn4 mt-1">
            Syndicate can help with basic formation, filings, and legal document
            templates{" "}
          </p>
        </div>
      </div>
    </a>
  );
};

export default CreateEntityCard;
