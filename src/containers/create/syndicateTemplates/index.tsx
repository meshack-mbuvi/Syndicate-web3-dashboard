import React from "react";
import { useDispatch } from "react-redux";
import ct from "countries-and-timezones";
import TemplateItem from "./templateItem";
import { setSyndicateTemplateTitle } from "@/redux/actions/createSyndicate/syndicateOffChainData";
import {
  setDepositTokenDetails,
  setDepositMembersMax,
} from "@/redux/actions/createSyndicate/syndicateOnChainData/tokenAndDepositsLimits";
import {
  setExpectedAnnualOperatingFees,
  setProfitShareToSyndicateLead,
} from "@/redux/actions/createSyndicate/syndicateOnChainData/feesAndDistribution";
import { setCloseDateAndTime } from "@/redux/actions/createSyndicate/syndicateOnChainData/closeDateAndTime";
import { setModifiable } from "@/redux/actions/createSyndicate/syndicateOnChainData/modifiable";
import { isDev } from "@/utils/environment";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";

// set default deposit token for each template to USDC
// depending on environment
let depositTokenAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
let depositTokenSymbol = "usdc";
let depositTokenLogo = "/images/prodTokenLogos/usd-coin-usdc.svg";
let depositTokenName = "USD Coin";
let depositTokenDecimals = 6;
if (isDev) {
  depositTokenAddress = "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926";
  depositTokenSymbol = "usdc";
  depositTokenLogo = "/images/TestnetTokenLogos/usdcIcon.svg";
  depositTokenName = "Testnet USDC";
  depositTokenDecimals = 6;
}

// current date
const now = new Date();
// Get timezone default values on create syndicate
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const timezones = ct.getAllTimezones();

// syndicate templates
// defaults include only values that will be updated in the redux store.
const templates = [
  {
    title: "SPV",
    subTitle: "Coinvest in a specific asset with a Special Purpose Vehicle",
    summary: [
      "USDC deposit token",
      "Up to 99 members",
      "Invite-only",
      "Fundraising ends in 1 month",
      "1% operating fees + 10% distribution share",
    ],
    defaults: {
      numMembersMax: "99",
      feesAndDistribution: {
        expectedAnnualOperatingFees: 1,
        profitShareToSyndicateLead: 10,
      },
      allowlist: {
        isAllowlistEnabled: false,
      },
      closeDateAndTime: {
        selectedDate: new Date(now.setMonth(now.getMonth() + 1)),
      },
    },
    disabled: false,
    depositTokenEditable: false,
  },
  {
    title: "Investment Fund",
    subTitle:
      "Coinvest in a series of investments across a range of types and categories",
    summary: [
      "USDC deposit token",
      "Up to 99 members",
      "Invite-only",
      "Fundraising ends in 6 months",
      "2% operating fees + 20% distribution share",
    ],
    defaults: {
      numMembersMax: "99",
      feesAndDistribution: {
        expectedAnnualOperatingFees: 2,
        profitShareToSyndicateLead: 20,
      },
      allowlist: {
        isAllowlistEnabled: false,
      },
      closeDateAndTime: {
        selectedDate: new Date(now.setMonth(now.getMonth() + 6)),
      },
    },
    disabled: false,
    depositTokenEditable: false,
  },
  {
    title: "Investment Club",
    subTitle: "Short and concise description of this syndicate template",
    summary: [
      "USDC deposit token",
      "Up to 99 members",
      "Invite-only",
      "Non-modifiable ownership",
      "0% operating fees + 0% distribution share",
    ],
    defaults: {
      numMembersMax: "99",
      modifiable: true,
      allowlist: {
        isAllowlistEnabled: false,
      },
    },
    disabled: false,
    depositTokenEditable: false,
  },
  {
    title: "Crowdfund/Grant DAO",
    subTitle: "Coinvest with the entire community",
    summary: [
      "Any deposit token",
      "Unlimited members",
      "Open to anyone with the link",
      "Non-modifiable ownership",
      "0% operating fees + 0% distribution share",
    ],
    defaults: {
      modifiable: true,
      allowlist: {
        isAllowlistEnabled: true,
      },
    },
    disabled: true,
    depositTokenEditable: false,
  },
];

const SyndicateTemplates: React.FC = () => {
  const dispatch = useDispatch();

  const { setCurrentTemplate } = useCreateSyndicateContext();

  const handleTemplateSelect = (template: any) => {
    const { title, defaults } = template;

    // store current template in context
    setCurrentTemplate(template);

    // store syndicate template title
    dispatch(setSyndicateTemplateTitle(title));

    //store template defaults
    // deposit token details.
    dispatch(
      setDepositTokenDetails({
        depositTokenAddress,
        depositTokenSymbol,
        depositTokenLogo,
        depositTokenName,
        depositTokenDecimals,
      }),
    );

    // Total members if set on template
    const { numMembersMax } = defaults;
    if (numMembersMax) {
      dispatch(setDepositMembersMax(numMembersMax));
    }

    // profit shares if the template doesn't use stored defaults.
    if (defaults.feesAndDistribution) {
      const { expectedAnnualOperatingFees, profitShareToSyndicateLead } =
        defaults.feesAndDistribution;
      dispatch(setExpectedAnnualOperatingFees(expectedAnnualOperatingFees)),
        dispatch(setProfitShareToSyndicateLead(profitShareToSyndicateLead));
    }

    // closing time if template doesn't use stored defaults.
    if (defaults.closeDateAndTime) {
      const { selectedDate } = defaults.closeDateAndTime;

      dispatch(
        setCloseDateAndTime({
          selectedDate,
          selectedTimeValue: "12:00 AM",
          selectedTimezone: {
            label: timezones[tz]?.name,
            value: timezones[tz]?.name,
            timezone: timezones[tz]?.utcOffsetStr,
          },
        }),
      );
    }

    // set modifiability
    if (defaults.modifiable) {
      const { modifiable } = defaults;

      dispatch(setModifiable(modifiable));
    }
  };
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-6 py-4">
      {templates.map((template, index) => {
        const {
          title,
          subTitle,
          summary,
          disabled,
          depositTokenEditable,
        } = template;
        return (
          <div
            onClick={() => (!disabled ? handleTemplateSelect(template) : null)}
          >
            <TemplateItem
              {...{ title, subTitle, summary, disabled, depositTokenEditable }}
              key={index}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SyndicateTemplates;
