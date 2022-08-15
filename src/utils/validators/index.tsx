import { LogicalOperator } from '@/components/tokenGating/tokenLogic';
import { TokenGateRule } from '@/state/createInvestmentClub/types';
import { NON_WORD_CHAR_REGEX, SYM_MAX_LENGTH } from '../constants';

export const validateEmail = (email: string): boolean => {
  const regexp = /^[\w.%+-]+@[\w.-]+\.[\w]{2,}$/;
  return regexp.test(email);
};

export const symbolValidation = (sym: string): Record<string, string> => {
  const errorText = {
    invalidChar: 'Only letters and numbers allowed',
    maxChar: `Up to ${SYM_MAX_LENGTH} characters allowed`
  };

  let res = {
    validSym: sym,
    errorMsg: ''
  };

  if (NON_WORD_CHAR_REGEX.test(sym)) {
    res = {
      validSym: sym.replaceAll(NON_WORD_CHAR_REGEX, ''),
      errorMsg: errorText.invalidChar
    };
  }

  if (res.validSym.length > SYM_MAX_LENGTH) {
    res = {
      validSym: res.validSym.slice(0, SYM_MAX_LENGTH),
      errorMsg: errorText.maxChar
    };
  }

  return res;
};

export const validateDuplicateRules = (
  rules: TokenGateRule[],
  logicalOperator: LogicalOperator
): number[] => {
  if (logicalOperator === LogicalOperator.AND) {
    // We split the rules into two groups:
    // 1. first group has the first 2 rules that are compared with the AND logic
    // 2. second group has the rest of the rules that are compared with the OR logic
    // After spliting we check for duplicates for both groups/Arrays
    const andRules = rules.slice(0, 2);
    const andRuleNames = new Set(andRules.map((rule) => rule.name));
    const andDuplicateRules = duplicateRules(andRules, andRuleNames);
    const andIndices = getIndices(andDuplicateRules, rules);

    const orRules = rules.slice(2);
    const orRuleNames = new Set(orRules.map((rule) => rule.name));
    const orDuplicateRules = duplicateRules(orRules, orRuleNames);
    const orIndices = getIndices(orDuplicateRules, rules);

    return Array.from(new Set(andIndices.concat(orIndices)));
  }
  const ruleNames = new Set(rules.map((rule) => rule.name));
  const dupRules = duplicateRules(rules, ruleNames);

  return getIndices(dupRules, rules);
};

export const validateNullRules = (rules: TokenGateRule[]): number[] => {
  const nullRules = rules.filter((rule) => !rule.name && rule.quantity > 1);

  const indices: number[] = [];

  nullRules.map((_rule) => {
    const index = rules.reduce(
      (acc, rule, idx) =>
        rule.name === _rule.name && rule.quantity > 1 ? [...acc, idx] : acc,
      []
    );
    indices.push(...index);
  });

  return Array.from(new Set(indices));
};

const duplicateRules = (
  rules: TokenGateRule[],
  ruleNames: Set<string>
): TokenGateRule[] =>
  rules.filter((rule) => {
    if (ruleNames.has(rule.name)) {
      ruleNames.delete(rule.name);
    } else {
      return rule.name;
    }
  });

const getIndices = (filtered: TokenGateRule[], rules: TokenGateRule[]) => {
  const indices: number[] = [];

  filtered.map((dupRule) => {
    const index = rules.reduce(
      (acc, rule, idx) => (rule.name === dupRule.name ? [...acc, idx] : acc),
      []
    );
    indices.push(...index);
  });

  return Array.from(new Set(indices));
};
