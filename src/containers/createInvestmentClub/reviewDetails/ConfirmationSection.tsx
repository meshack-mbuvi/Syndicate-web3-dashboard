import Image from 'next/image';
import { TokenGateOption } from '@/state/createInvestmentClub/types';
import { animated } from 'react-spring';
import ReviewSection, { ReviewSectionVariant } from './ReviewSection';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { CreateActiveSteps } from '@/context/CreateInvestmentClubContext/steps';
import { LogicalOperator } from '@/components/tokenGating/tokenLogic';
import useClubMixinGuardFeatureFlag from '@/hooks/clubs/useClubsMixinGuardFeatureFlag';

interface ConfirmationSectionProps {
  hasCheckedAgreement: boolean;
  handleCheckedAgreement: () => void;
}

const ConfirmationSection: React.FC<ConfirmationSectionProps> = ({
  hasCheckedAgreement,
  handleCheckedAgreement
}) => {
  const { investmentClubSymbol, tokenGateOption, tokenRules, logicalOperator } =
    useSelector((state: AppState) => state.createInvestmentClubSliceReducer);

  const { isReady, isClubMixinGuardTreatmentOn } =
    useClubMixinGuardFeatureFlag();
  const {
    currentStep,
    stepsNames,
    isCreatingInvestmentClub,
    setCurrentStep,
    setEditingStep
  } = useCreateInvestmentClubContext();

  // TODO: after branches merged get amountToMintPerAddress
  // and remove temp values below:
  const amountToMintPerAddress = 10;

  const tokens = tokenRules.filter((rule) => rule.name);

  const handleEditMembership = () => {
    setEditingStep(currentStep);
    setCurrentStep(stepsNames.indexOf(CreateActiveSteps.MEMBERSHIP));
  };

  return (
    <>
      <div className="mb-6 w-full">
        {isReady &&
          isClubMixinGuardTreatmentOn &&
          (isCreatingInvestmentClub ? (
            <ReviewSection
              isDisplayingSection={true}
              variant={ReviewSectionVariant.EDITABLE}
              sectionTitle={'Who is allowed to deposit and become a member?'}
              onClick={handleEditMembership}
            >
              <div className="mt-2 text-base text-white w-full">
                {tokenGateOption === TokenGateOption.UNRESTRICTED ? (
                  <p>{'Anyone with the link'}</p>
                ) : (
                  <>
                    <div>{'Holders of'}</div>
                    <div className="grid auto-cols-auto sm:flex sm:flex-wrap">
                      {tokens.map((t, i) => {
                        return (
                          <div
                            key={`${t.name}-${i}`}
                            className="flex min-w-0 items-center mt-1"
                          >
                            <div
                              className={
                                'flex min-w-0 flex-shrink-1 items-center rounded-full bg-gray-syn8 px-4 py-2 group-hover:bg-black'
                              }
                            >
                              <p className="mr-2">{t.quantity}</p>
                              <div className="relative flex-shrink-0 w-6 h-6">
                                <Image
                                  layout="fill"
                                  src={t.icon || '/images/token-gray-5.svg'}
                                />
                              </div>
                              <p className="ml-2 shrink-1 truncate overflow-hidden whitespace-nowrap">
                                {t.name}
                              </p>
                            </div>
                            {i < tokens.length - 1 ? (
                              <p className="mr-2 ml-px flex-shrink-0">
                                {i === 0
                                  ? logicalOperator.toLowerCase()
                                  : LogicalOperator.OR.toLowerCase()}
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </ReviewSection>
          ) : (
            <ReviewSection
              isDisplayingSection={true}
              variant={ReviewSectionVariant.EDITABLE}
              sectionTitle={'Mint amount (per address)'}
              onClick={handleEditMembership}
            >
              <div className="flex mt-2 text-base">
                <p className="text-white">{amountToMintPerAddress}</p>
                <span className="ml-2 text-white">✺{investmentClubSymbol}</span>
              </div>
            </ReviewSection>
          ))}
      </div>
      <div className="w-full mb-36 max-w-520 sm:px-5">
        <div className="flex items-center space-between ">
          <input
            className="self-start bg-transparent rounded focus:ring-offset-0 cursor-pointer"
            onChange={handleCheckedAgreement}
            type="checkbox"
            id="agreementFirst"
            name="agreementFirst"
            checked={hasCheckedAgreement}
          />
          <animated.div
            className="text-xs text-gray-syn4 leading-4.5 pl-4 cursor-pointer select-none"
            onClick={handleCheckedAgreement}
          >
            <div className="mb-2">
              By accessing or using Syndicate’s app and its protocol, I agree
              that:
            </div>

            <ul className="list-disc list-outside ml-0 pl-6">
              <li>
                I will not violate securities laws by using Syndicate’s app and
                its protocol, and to the extent necessary, will seek legal
                counsel to ensure compliance with securities laws in relevant
                jurisdictions.
              </li>
              <li>
                Any information or documentation provided has not been prepared
                with my specific circumstances in mind and may not be suitable
                for use in my personal circumstances.
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
                limited to (a) distributing defamatory, obscene or unlawful
                content or content that promotes bigotry, racism, misogyny or
                religious or ethnic hatred, (b) transmitting any information or
                data that infringes any intellectual property rights of any
                third party or that is otherwise libelous, unlawful, or
                tortious, (c) stalking, harassment, or threatening others with
                violence or abuse, or (d) violating any anti-money laundering
                laws, anti-terrorist financing laws, anti-bribery or
                anti-boycott laws, or other applicable laws.
              </li>
            </ul>
          </animated.div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationSection;