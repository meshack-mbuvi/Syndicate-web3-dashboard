const generateTimeIntervals = (): string[] => {
  const times = [],
    periods = ["AM", "PM"],
    hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let prop = null,
    hour = null,
    min = null;

  for (prop in periods) {
    for (hour in hours) {
      for (min = 0; min < 60; min += 60) {
        times.push(
          ("0" + hours[hour]).slice(-2) +
            ":" +
            ("0" + min).slice(-2) +
            " " +
            periods[prop],
        );
      }
    }
  }
  return times;
};

export default generateTimeIntervals;
