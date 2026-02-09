import { MATCH_STATUS } from "../validation/matches.js";

export const getMatchStatus = (startTime, endTime, now = new Date()) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid date format for startTime or endTime");
  }

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  } else if (now >= start && now <= end) {
    return MATCH_STATUS.LIVE;
  } else {
    return MATCH_STATUS.FINISHED;
  }
};
