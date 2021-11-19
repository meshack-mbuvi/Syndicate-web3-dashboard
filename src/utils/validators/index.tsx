import { NON_WORD_CHAR_REGEX, SYM_MAX_LENGTH } from "../constants";

export const validateEmail = (email: string): boolean => {
  const regexp = /^[\w.%+-]+@[\w.-]+\.[\w]{2,}$/;
  return regexp.test(email);
};

export const symbolValidation = (sym: string): Record<string, string> => {
  const errorText = {
    invalidChar: "Only letters and numbers allowed",
    maxChar: `Up to ${SYM_MAX_LENGTH} characters allowed`,
  };

  let res = {
    validSym: sym,
    errorMsg: "",
  };

  if (NON_WORD_CHAR_REGEX.test(sym)) {
    res = {
      validSym: sym.replaceAll(NON_WORD_CHAR_REGEX, ""),
      errorMsg: errorText.invalidChar,
    };
  }

  if (res.validSym.length > SYM_MAX_LENGTH) {
    res = {
      validSym: res.validSym.slice(0, SYM_MAX_LENGTH),
      errorMsg: errorText.maxChar,
    };
  }

  return res;
};
