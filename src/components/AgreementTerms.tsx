const AgreementTerms: React.FC<{
  hasAgreed: boolean;
  handleAgreed: () => void;
  customClassName?: string;
}> = ({ hasAgreed, handleAgreed, customClassName }) => {
  return (
    <div className="flex items-center space-between px-1">
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
        <div className={customClassName}>
          By accessing or using Syndicate’s app and its protocol, I agree that I
          will not use Syndicate’s app and its protocol to engage in illegal,
          fraudulent or other wrongful conduct, including but not limited to (a)
          distributing defamatory, obscene or unlawful content or content that
          promotes bigotry, racism, misogyny or religious or ethnic hatred, (b)
          transmitting any information or data that infringes any intellectual
          property rights of any third party or that is otherwise libelous,
          unlawful, or tortious, (c) stalking, harassment, or threatening others
          with violence or abuse, or (d) violating any securities laws,
          anti-money laundering laws, anti-terrorist financing laws,
          anti-bribery or anti-boycott laws, or other applicable laws, and to
          the extent necessary, I agree I will seek legal counsel to ensure
          compliance with applicable laws in relevant jurisdictions.
        </div>
      </button>
    </div>
  );
};

export default AgreementTerms;
