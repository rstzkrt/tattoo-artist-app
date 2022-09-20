import {ReviewResponseDto, ReviewType} from "../generated-apis/review";
import {UserResponseDto} from "../generated-apis/user";

export class Review implements ReviewResponseDto{
  id: string;
  message: string;
  postedBy: UserResponseDto;
  receiver: string;
  reviewType: ReviewType;
}
