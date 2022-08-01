const AgreementTerms: React.FC<{
  hasAgreed: boolean;
  handleAgreed: () => void;
}> = ({ hasAgreed, handleAgreed }) => {
  return (
    <div className="flex items-center space-between">
      <input
        className="self-start bg-transparent rounded focus:ring-offset-0 cursor-pointer"
        onChange={handleAgreed}
        type="checkbox"
        id="agreementFirst"
        name="agreementFirst"
        checked={hasAgreed}
      />
      <button
        className="text-xs text-gray-syn4 leading-4.5 pl-4 cursor-pointer select-none text-left"
        onClick={handleAgreed}
      >
        <div>
          By accessing or using Syndicate’s app and its protocol, I agree that:
        </div>

        <ul className="list-disc list-outside ml-0 pl-6">
          <li>
            I will not violate securities laws by using Syndicate’s app and its
            protocol, and to the extent necessary, will seek legal counsel to
            ensure compliance with securities laws in relevant jurisdictions.
          </li>
          <li>
            Any information or documentation provided has not been prepared with
            my specific circumstances in mind and may not be suitable for use in
            my personal circumstances.
          </li>
          <li>
            Syndicate or any of its advisors (including Syndicate’s tax and
            legal advisors) have not provided me any legal advice or other
            professional advice, and no confidential or special relationship
            between me and Syndicate or its affiliates or advisors exists.
          </li>
          <li>
            I will not use Syndicate’s app and its protocol to engage in
            illegal, fraudulent or other wrongful conduct, including but not
            limited to (a) distributing defamatory, obscene or unlawful content
            or content that promotes bigotry, racism, misogyny or religious or
            ethnic hatred, (b) transmitting any information or data that
            infringes any intellectual property rights of any third party or
            that is otherwise libelous, unlawful, or tortious, (c) stalking,
            harassment, or threatening others with violence or abuse, or (d)
            violating any anti-money laundering laws, anti-terrorist financing
            laws, anti-bribery or anti-boycott laws, or other applicable laws.
          </li>
        </ul>
      </button>
    </div>
  );
};

export default AgreementTerms;
