import Joi from "joi";

// validation schema for new syndicate form
export const syndicateSchema = Joi.object({
  closeDate: Joi.date().required().label("Close date").messages({
    "any.empty": "Fund Close date must be provided.",
  }),
  depositToken: Joi.string().required().label("Deposit token").messages({
    "any.empty": "Deposit token must be provided.",
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
  distributionToken: Joi.string()
    .required()
    .label("Distribution Token")
    .messages({
      "any.empty": "Distribution token must be provided.",
    }),
  profitShareToSyndProtocol: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "object.regex":
        "Profit shares can only include at most two decimal places. For example, 1.005% is not allowed. 1.05% is allowed, as well as 1.5% or 1%",
    }),
  profitShareToSyndicateLead: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "object.regex":
        "Profit shares can only include at most two decimal places. For example, 1.005% is not allowed. 1.05% is allowed, as well as 1.5% or 1%",
    }),
  expectedAnnualOperatingFees: Joi.string()
    .regex(/^\d+(\.\d{0,2})?$/)
    .messages({
      "object.regex":
        "Expected Annual Operating Fees can only include at most two decimal places. For example, 1.005% is not allowed. 1.05% is allowed, as well as 1.5% or 1%",
    }),
});

export const depositSchema = Joi.object({
  depositAmount: Joi.string()
    .required()
    .label("Deposit amount")
    .messages({ "any.empty": "Deposit amount is required" }),
  currency: Joi.string(),
  accredited: Joi.boolean().invalid(false).messages({
    "any.invalid":
      "You must attest that you are an accredited investor by checking the accredited investor box to confirm.",
  }),
});
