import { checkboxSingle, date, endDate, text } from "utils/forms/schemas";

export default {
  "aep-programName": text(),
  "aep-startDate": date(),
  "aep-endDate": endDate("aep-startDate"),
  "aep-combinedData": checkboxSingle(),
};