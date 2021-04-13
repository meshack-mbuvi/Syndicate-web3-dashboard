import { AddressValidator } from "@/utils/addressValidator";
import Joi from "@hapi/joi";

// validation schema for new syndicate form
export const syndicateSchema = Joi.object({
  closeDate: Joi.date().required().label("Close date").messages({
    "any.empty": "Fund Close date must be provided.",
  }),
  depositToken: Joi.string()
    .required()
    .custom(AddressValidator)

    .label("Deposit token")
    .messages({
      "any.empty": "Deposit token must be provided.",
      "any.invalid":
        "Please provide a valid ERC20 address that can deposit or withdraw funds",
    }),

  maxDeposits: Joi.number().required().label("Maximum deposits").messages({
    "any.empty": "Max deposits must be provided.",
  }),
  maxTotalDeposits: Joi.number()
    .min(Joi.ref("maxDeposits"))
    .required()
    .label("Maximum Total deposits")
    .messages({
      "any.empty": "Total maximum deposits must be provided.",
      "number.min":
        "Total maximum deposits must be greater than or equal to max deposits",
    }),
  profitShareToSyndProtocol: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "string.pattern.base":
        "Profit shares can only include at most two decimal places. For example, 1.005% is not allowed. 1.05% is allowed, as well as 1.5% or 1%",
    }),
  profitShareToSyndicateLead: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "string.pattern.base":
        "Profit shares can only include at most two decimal places. For example, 1.005% is not allowed. 1.05% is allowed, as well as 1.5% or 1%",
    }),
  expectedAnnualOperatingFees: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "string.pattern.base":
        "Expected Annual Operating Fees can only include at most two decimal places. For example, 1.005% is not allowed. 1.05% is allowed, as well as 1.5% or 1%",
    }),
});

export const depositSchema = Joi.object({
  depositAmount: Joi.string()
    .required()
    .label("Amount")
    .messages({ "any.empty": "Amount is required" }),
});
