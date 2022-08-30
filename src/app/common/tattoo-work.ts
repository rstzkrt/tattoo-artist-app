import {MadeByInfo, TattooWorksResponseDto} from "../generated-apis/tatoo-work";
import {Currency} from "../generated-apis/user";

export class TattooWork implements TattooWorksResponseDto{
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
