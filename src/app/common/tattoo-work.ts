import {MadeByInfo, TattooStyle, TattooWorksResponseDto, TattooWorkTakenReportDto} from "../generated-apis/tatoo-work";
import {Currency} from "../generated-apis/user";

export class TattooWork implements TattooWorksResponseDto{
  disLikerIds: Array<string>;
  likerIds: Array<string>;
  takenReports: Array<TattooWorkTakenReportDto>;
  tattooStyle: TattooStyle;
  madeBy: MadeByInfo;
  clientId: string;
  commentId: string;
  coverPhoto: string;
  currency: Currency;
  description: string;
  dislike_number: number;
  id: string;
  like_number: number;
  photos: Array<string>;
  price: number;
}
