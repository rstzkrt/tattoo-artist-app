/* tslint:disable */
/* eslint-disable */
import { ReviewType } from './review-type';
export interface ReviewPostRequestDto {
  message?: string;
  postedBy?: string;
  reviewType?: ReviewType;
}
