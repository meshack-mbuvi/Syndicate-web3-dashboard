import { AddressValidator } from "@/utils/inputValidators";
import Joi from "@hapi/joi";

// validation schema for new syndicate form
export const syndicateSchema = Joi.object({
  depositToken: Joi.string()
    .required()
    .custom(AddressValidator)
    .label("Deposit token")
    .messages({
      "string.empty": "This field cannot be empty.",
      "any.invalid":
        "Please provide a valid ERC20 address that can deposit or withdraw funds",
    }),
  maxDeposits: Joi.number().required().label("Maximum deposits").messages({
    "string.empty": "This field cannot be empty.",
  }),
  maxTotalDeposits: Joi.number()
    .min(Joi.ref("maxDeposits"))
    .required()
    .label("Maximum Total deposits")
    .messages({
      "string.empty": "This field cannot be empty.",
      "number.min":
        "Total maximum deposits must be greater than or equal to max deposits",
    }),
  profitShareToSyndProtocol: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "string.pattern.base":
        "Profit shares can only include at most two decimal places.",
      "string.empty": "This field cannot be empty.",
    }),
  profitShareToSyndicateLead: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "string.pattern.base":
        "Profit shares can only include at most two decimal places.",
      "string.empty": "This field cannot be empty.",
    }),
  expectedAnnualOperatingFees: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "string.pattern.base":
        "Expected Annual Operating Fees can only include at most two decimal places.",
      "string.empty": "This field cannot be empty.",
    }),
});

export const depositSchema = Joi.object({
  depositAmount: Joi.string()
    .required()
    .label("Amount")
    .messages({ "string.empty": "This field cannot be empty." }),
});
