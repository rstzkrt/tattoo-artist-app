import {CommentResponseDto} from "../generated-apis/comment";

export class Comment implements CommentResponseDto{
  id: string;
  message: string;
  postDate: string;
  postedBy: string;
  rate: number;
  workId: string;
}
