/* tslint:disable */
/* eslint-disable */
import { Currency } from './currency';
export interface TattooWorkPatchRequestDto {
  coverPhoto?: string;
  currency?: Currency;
  description?: string;
  photos?: Array<string>;
  price?: number;
}
