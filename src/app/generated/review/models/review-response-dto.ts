/* tslint:disable */
/* eslint-disable */
import { ReviewType } from './review-type';
export interface ReviewResponseDto {
  id?: string;
  message?: string;
  postedBy?: string;
  receiver?: string;
  reviewType?: ReviewType;
}
