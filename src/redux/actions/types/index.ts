import { initialState } from "@/redux/reducers/initialState";

// state typings
export type State = typeof initialState;

export const SET_WEB3 = "SET_WEB3";
export const UNSET_WEB3 = "UNSET_WEB3";
export const SET_LOADING = "SET_LOADING";
export const SET_PROVIDER = "SET_PROVIDER";
export const CONNECTING = "CONNECTING";
export const CONNECTED = "CONNECTED";
export const CONNECT = "CONNECT";
export const DISCONNECTED = "DISCONNECTED";
export const SHOW_WALLET_MODAL = "SHOW_WALLET_MODAL";
export const HIDE_WALLET_MODAL = "HIDE_WALLET_MODAL";
export const ADD_NEW_INVESTMENT = "ADD_NEW_INVESTMENT";
export const ALL_SYNDICATES = "ALL_SYNDICATES";
export const SHOW_ERROR_MODAL = "SHOW_ERROR_MODAL";
export const HIDE_ERROR_MODAL = "HIDE_ERROR_MODAL";
export const SET_SUBMITTING = "SET_SUBMITTING";
export const SET_SYNDICATE_DETAILS = "SET_SYNDICATE_DETAILS";
export const LOADING_SYNDICATE_DETAILS = "LOADING_SYNDICATE_DETAILS";
export const LOADING_SYNDICATE_MEMBER_DETAILS =
  "LOADING_SYNDICATE_MEMBER_DETAILS";
export const SET_MEMBER_DEPOSIT_DETAILS = "SET_MEMBER_DEPOSIT_DETAILS";
export const SET_MEMBER_WITHDRAWAL_DETAILS = "SET_MEMBER_WITHDRAWAL_DETAILS";
export const STORE_SYNDICATE_INSTANCE = "STORE_SYNDICATE_INSTANCE";
export const SYNDICATE_BY_ADDRESS = "SYNDICATE_BY_ADDRESS";
export const INVALID_SYNDICATE_ADDRESS = "INVALID_SYNDICATE_ADDRESS";
export const UPDATE_SYNDICATE_DETAILS = "UPDATE_SYNDICATE_DETAILS";
export const STORE_DEPOSIT_TOKEN_ALLOWANCE = "STORE_DEPOSIT_TOKEN_ALLOWANCE";
export const STORE_DISTRIBUTION_TOKENS_ALLOWANCES =
  "STORE_DISTRIBUTION_TOKENS_ALLOWANCES";
export const ONE_SYNDICATE_PER_ACCOUNT = "ONE_SYNDICATE_PER_ACCOUNT";
export const SET_MANAGER_FEE_ADDRESS = "SET_MANAGER_FEE_ADDRESS";
export const SET_NEW_MEMBER_ADDRESSES = "SET_NEW_MEMBER_ADDRESSES";
export const FOUND_SYNDICATE_ADDRESS = "FOUND_SYNDICATE_ADDRESS";
export const SET_PROVIDER_NAME = "SET_PROVIDER_NAME";
export const SET_SYNDICATE_DISTRIBUTION_TOKENS =
  "SET_SYNDICATE_DISTRIBUTION_TOKENS";

export const SET_SYNDICATE_DISTRIBUTIONS = "SET_SYNDICATE_DISTRIBUTIONS";

export const INITIALIZE_CONTRACTS = "INITIALIZE_CONTRACTS";
export const USER_LOGOUT = "USER_LOGOUT";

export const STORE_ETHEREUM_NETWORK = "STORE_ETHEREUM_NETWORK";
export const STORE_CURRENT_ETH_NETWORK = "STORE_CURRENT_ETH_NETWORK";

// manage members
export const SET_SYNDICATE_MANAGE_MEMBERS = "SET_SYNDICATE_MANAGE_MEMBERS";
export const SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS =
  "SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS";

// Manage actions
export const SHOW_MODIFY_MEMBER_DISTRIBUTIONS =
  "SHOW_MODIFY_MEMBER_DISTRIBUTIONS";
export const SHOW_MODIFY_CAP_TABLE = "SHOW_MODIFY_CAP_TABLE";
export const SET_SELECTED_MEMBER_ADDRESS = "SET_SELECTED_MEMBER_ADDRESS";
export const SET_SHOW_REJECT_MEMBER_DEPOSIT_OR_ADDRESS =
  "SET_SHOW_REJECT_MEMBER_DEPOSIT_OR_ADDRESS";
export const SHOW_REJECT_MEMBER_ADDRESS_ONLY =
  "SHOW_REJECT_MEMBER_ADDRESS_ONLY";
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
export const CONFIRM_RETURN_DEPOSIT = "CONFIRM_RETURN_DEPOSIT";
export const RESET_MEMBER_DEPOSITS = "RESET_MEMBER_DEPOSITS";
