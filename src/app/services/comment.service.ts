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

  deleteCommentById(commentId: string,token:string): Observable<any> {
    this.commentService.configuration.credentials= {"bearerAuth": token};
    return this.commentService.deleteCommentById(commentId)
  }

  editComment(commentId: string, commentPatchRequestDto: CommentPatchRequestDto,token:string): Observable<CommentResponseDto> {
    this.commentService.configuration.credentials= {"bearerAuth": token};
    return this.commentService.editComment(commentId,commentPatchRequestDto)
  }

  getCommentById(commentId: string): Observable<CommentResponseDto> {
    return this.commentService.getCommentById(commentId)
  }

  getCommentByTattooWorkId(tattooWorkId: string): Observable<CommentResponseDto> {
    return this.commentService.getCommentByTattooWorkId(tattooWorkId)
  }
}
