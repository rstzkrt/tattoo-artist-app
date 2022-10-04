import {TattooWorkReportPostReqDto} from "../generated-apis/tattoo-work-report";

export class TattooWorkReportPost implements TattooWorkReportPostReqDto{
  description: string;
  reportOwnerId: string;
  reportedTattooWorkId: string;
}
