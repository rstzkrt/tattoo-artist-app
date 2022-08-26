/* tslint:disable */
/* eslint-disable */
import { Currency } from './currency';
export interface TattooWorkPostRequestDto {
  clientId?: string;
  coverPhoto?: string;
  currency?: Currency;
  description?: string;
  madeById?: string;
  photos?: Array<string>;
  price?: number;
}
