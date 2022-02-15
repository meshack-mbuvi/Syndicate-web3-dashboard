import moment from "moment";

export const formatTime = (date: string): string => {
  return moment.utc(date).format("YYYYMMDD");
};

export const buildUrl = (
  calEvent: Record<string, string>,
  type: string,
): string => {
  let calendarUrl = "";

  switch (type) {
    case "google":
      calendarUrl = "https://calendar.google.com/calendar/render";
      calendarUrl += "?action=TEMPLATE";
      calendarUrl += "&dates=" + formatTime(calEvent.startTime);
      calendarUrl += "/" + formatTime(calEvent.endTime);
      calendarUrl += "&location=" + encodeURIComponent(calEvent.location);
      calendarUrl += "&text=" + encodeURIComponent(calEvent.title);
      calendarUrl += "&details=" + encodeURIComponent(calEvent.description);
      break;

    default:
      calendarUrl = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        "URL:" + document.URL,
        "DTSTART:" + formatTime(calEvent.startTime),
        "DTEND:" + formatTime(calEvent.endTime),
        "SUMMARY:" + calEvent.title,
        "DESCRIPTION:" + calEvent.description,
        "LOCATION:" + calEvent.location,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\n");

      if (isMobile()) {
        calendarUrl = encodeURI(
          "data:text/calendar;charset=utf8," + calendarUrl,
        );
      }
  }

  return calendarUrl;
};

export const isMobile = (): boolean => {
  let isMobile = false;
  if (navigator.userAgent) {
    isMobile = Boolean(
      navigator.userAgent.match(/Android|iPhone|iPad|IEMobile|WPDesktop/i),
    );
  }
  return isMobile;
};
