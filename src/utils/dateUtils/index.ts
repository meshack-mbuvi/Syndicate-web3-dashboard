export const formatDate = (dateString: Date): string =>
  dateString.toLocaleDateString();

/**
 * This method checks whether the provided date is in the past or not.
 * This function can be used to determine whether deposits are enabled or not.
 * Deposits are disabled if closeDate has not been reached.
 * @param {*} date close date
 * @returns {boolean}
 */
export const pastDate = (date: Date): boolean => {
  try {
    const currentDate = Date.now();
    return currentDate > date.getTime();
  } catch (error) {
    return false;
  }
};

export const getUnixTimeFromDate = (date: Date): number =>
  Math.round(new Date(date).getTime() / 1000);
