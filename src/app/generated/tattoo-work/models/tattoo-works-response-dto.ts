/* tslint:disable */
/* eslint-disable */
import { Currency } from './currency';
export interface TattooWorksResponseDto {
  clientId?: string;
  commentId?: string;
  coverPhoto?: string;
  currency?: Currency;
  description?: string;
  dislike_number?: number;
  id?: string;
  like_number?: number;
  madeById?: string;
  photos?: Array<string>;
  price?: number;
}
