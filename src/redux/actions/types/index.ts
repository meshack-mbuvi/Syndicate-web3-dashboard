import { initialState } from "@/redux/reducers/initialState";

// state typings
export type State = typeof initialState;

export const SET_LOADING = "SET_LOADING";
export const ALL_SYNDICATES = "ALL_SYNDICATES";
export const SET_SUBMITTING = "SET_SUBMITTING";
export const SET_SYNDICATE_DETAILS = "SET_SYNDICATE_DETAILS";
export const LOADING_SYNDICATE_DETAILS = "LOADING_SYNDICATE_DETAILS";
export const LOADING_SYNDICATE_MEMBER_DETAILS =
  "LOADING_SYNDICATE_MEMBER_DETAILS";
export const SET_MEMBER_DEPOSIT_DETAILS = "SET_MEMBER_DEPOSIT_DETAILS";
export const SET_MEMBER_WITHDRAWAL_DETAILS = "SET_MEMBER_WITHDRAWAL_DETAILS";
export const SET_MEMBER_ACTIVITY = "SET_MEMBER_ACTIVITY";
export const LOADING_SYNDICATE_ACTIVITY = "LOADING_SYNDICATE_ACTIVITY";
export const SYNDICATE_BY_ADDRESS = "SYNDICATE_BY_ADDRESS";
export const INVALID_SYNDICATE_ADDRESS = "INVALID_SYNDICATE_ADDRESS";
export const SYNDICATE_NOT_FOUND = "SYNDICATE_NOT_FOUND";
export const UPDATE_SYNDICATE_DETAILS = "UPDATE_SYNDICATE_DETAILS";
export const STORE_DEPOSIT_TOKEN_ALLOWANCE = "STORE_DEPOSIT_TOKEN_ALLOWANCE";
export const STORE_DISTRIBUTION_TOKENS_ALLOWANCES =
  "STORE_DISTRIBUTION_TOKENS_ALLOWANCES";
export const ONE_SYNDICATE_PER_ACCOUNT = "ONE_SYNDICATE_PER_ACCOUNT";
export const SET_MANAGER_FEE_ADDRESS = "SET_MANAGER_FEE_ADDRESS";
export const FOUND_SYNDICATE_ADDRESS = "FOUND_SYNDICATE_ADDRESS";
export const SET_SYNDICATE_DISTRIBUTION_TOKENS =
  "SET_SYNDICATE_DISTRIBUTION_TOKENS";

export const INITIALIZE_CONTRACTS = "INITIALIZE_CONTRACTS";
export const USER_LOGOUT = "USER_LOGOUT";

// manage members
export const SET_SYNDICATE_MANAGE_MEMBERS = "SET_SYNDICATE_MANAGE_MEMBERS";
export const SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS =
  "SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS";

// Manage actions
export const SHOW_MODIFY_MEMBER_DISTRIBUTIONS =
  "SHOW_MODIFY_MEMBER_DISTRIBUTIONS";
export const SHOW_MODIFY_CAP_TABLE = "SHOW_MODIFY_CAP_TABLE";
export const SET_SELECTED_MEMBER_ADDRESS = "SET_SELECTED_MEMBER_ADDRESS";
export const SHOW_REJECT_MEMBER_DEPOSIT_ONLY =
  "SHOW_REJECT_MEMBER_DEPOSIT_ONLY";
export type STATE = typeof initialState;

// create syndicate type constants

// token and deposits limit section
const SET_NUM_MEMBERS_MAX = "SET_NUM_MEMBERS_MAX";
const SET_DEPOSIT_MEMBER_MIN = "SET_DEPOSIT_MEMBER_MIN";
const SET_DEPOSIT_MEMBER_MAX = "SET_DEPOSIT_MEMBER_MAX";
const SET_DEPOSIT_TOTAL_MAX = "SET_DEPOSIT_TOTAL_MAX";
const SET_DEPOSIT_TOKEN_DETAILS = "SET_DEPOSIT_TOKEN_DETAILS";

export const TOKEN_AND_DEPOSITS_TYPES = {
  SET_NUM_MEMBERS_MAX,
  SET_DEPOSIT_MEMBER_MIN,
  SET_DEPOSIT_MEMBER_MAX,
  SET_DEPOSIT_TOTAL_MAX,
  SET_DEPOSIT_TOKEN_DETAILS,
};

// syndicate details
const SYNDICATE_TYPE = "SYNDICATE_TYPE";
const EMAIL = "EMAIL";
const ORGANIZATION = "ORGANIZATION";
const COUNTRY = "COUNTRY";
const SYNDICATE_NAME = "SYNDICATE_NAME";

export const SYNDICATE_OFF_CHAIN_TYPES = {
  SYNDICATE_NAME,
  COUNTRY,
  ORGANIZATION,
  EMAIL,
  SYNDICATE_TYPE,
};

export const FEES_AND_DISTRIBUTION_TYPES = {
  EXPECTED_ANNUAL_OPERATING_FEES: "EXPECTED_ANNUAL_OPERATING_FEES",
  PROFIT_SHARE_TO_SYNDICATE_LEAD: "PROFIT_SHARE_TO_SYNDICATE_LEAD",
  SYNDICATE_PROFIT_SHARE_PERCENT: "SYNDICATE_PROFIT_SHARE_PERCENT",
};

export const SET_MODIFIABLE = "SET_MODIFIABLE";
export const SET_TRANSFERABLE = "SET_TRANSFERABLE";

export const ALLOWLIST_TYPES = {
  SET_IS_ALLOWLIST_ENABLED: "SET_IS_ALLOWLIST_ENABLED",
  SET_MEMBER_ADDRESSES: "SET_MEMBER_ADDRESSES",
  SET_ALLOW_REQUEST_TO_ALLOWLIST: "SET_ALLOW_REQUEST_TO_ALLOWLIST",
};

export const SET_CLOSE_DATE_AND_TIME = "SET_CLOSE_DATE_AND_TIME";

export const RESET_CREATE_SYNDICATE_STORE = "RESET_CREATE_SYNDICATE_STORE";

export const SYNDICATE_TEMPLATE_TITLE = "SELECTED_TEMPLATE_TITLE";

// manager tools
export const RETURNING_DEPOSIT = "RETURNING_DEPOSIT";
export const TRANSFERRING_DEPOSIT = "TRANSFERRING_DEPOSIT";
export const CONFIRM_RETURN_DEPOSIT = "CONFIRM_RETURN_DEPOSIT";

export const CONFIRM_BLOCK_MEMBER_ADDRESS = "CONFIRM_BLOCK_MEMBER_ADDRESS";
export const BLOCKING_MEMBER_ADDRESS = "BLOCKING_MEMBER_ADDRESS";
export const SELECTED_MEMBER = "SELECTED_MEMBER";
export const SHOW_TRANSFER_DEPOSIT_MODAL = "SHOW_TRANSFER_DEPOSIT_MODAL";

export const CONFIRM_MODIFY_MEMBER_DEPOSIT = "CONFIRM_MODIFY_MEMBER_DEPOSIT";
export const MODIFYING_MEMBER_DEPOSIT = "MODIFYING_MEMBER_DEPOSIT";

export const SET_SELECTED_MEMBERS = "SET_SELECTED_MEMBERS";
export const ADD_NEW_MEMBER_TO_SELECTED_MEMBERS =
  "ADD_NEW_MEMBER_TO_SELECTED_MEMBERS";
export const ADD_TO_SYNDICATE_MEMBERS = "ADD_TO_SYNDICATE_MEMBERS";
