import {ReviewResponseDto, ReviewType} from "../generated-apis/review";

export class Review implements ReviewResponseDto{
  id: string;
  message: string;
  postedBy: string;
  receiver: string;
  reviewType: ReviewType;
}
