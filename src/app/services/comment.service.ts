import { Injectable } from '@angular/core';
import {CommentPatchRequestDto, CommentRequestDto, CommentResponseDto, DefaultService} from "../generated-apis/comment";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CommentService{
  private _rootUrl: string="http://localhost:8080";
  constructor(private commentService:DefaultService) {
    commentService.configuration.basePath=this._rootUrl;
  }

  createComment(tattooWorkId: string, commentRequestDto: CommentRequestDto): Observable<CommentResponseDto> {
    return this.commentService.createComment(tattooWorkId,commentRequestDto);
  }

  deleteCommentById(commentId: string): Observable<any> {
    return this.commentService.deleteCommentById(commentId)
  }

  editComment(commentId: string, commentPatchRequestDto: CommentPatchRequestDto): Observable<CommentResponseDto> {
    return this.commentService.editComment(commentId,commentPatchRequestDto)
  }

  getCommentById(commentId: string): Observable<CommentResponseDto> {
    return this.commentService.getCommentById(commentId)
  }

  getCommentsByTattooWorkId(tattooWorkId: string): Observable<Array<CommentResponseDto>> {
    return this.commentService.getCommentsByTattooWorkId(tattooWorkId)
  }
}
