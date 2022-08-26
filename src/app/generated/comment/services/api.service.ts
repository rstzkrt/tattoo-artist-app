/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { CommentPatchRequestDto } from '../models/comment-patch-request-dto';
import { CommentRequestDto } from '../models/comment-request-dto';
import { CommentResponseDto } from '../models/comment-response-dto';

@Injectable({
  providedIn: 'root',
})
export class ApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getCommentById
   */
  static readonly GetCommentByIdPath = '/comments/{comment_id}';

  /**
   * get comment by id
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCommentById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCommentById$Response(params: {

    /**
     * comment id
     */
    comment_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CommentResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetCommentByIdPath, 'get');
    if (params) {
      rb.path('comment_id', params.comment_id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CommentResponseDto>;
      })
    );
  }

  /**
   * get comment by id
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCommentById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCommentById(params: {

    /**
     * comment id
     */
    comment_id: string;
    context?: HttpContext
  }
): Observable<CommentResponseDto> {

    return this.getCommentById$Response(params).pipe(
      map((r: StrictHttpResponse<CommentResponseDto>) => r.body as CommentResponseDto)
    );
  }

  /**
   * Path part for operation deleteCommentById
   */
  static readonly DeleteCommentByIdPath = '/comments/{comment_id}';

  /**
   * delete comment by id
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteCommentById()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCommentById$Response(params: {

    /**
     * comment id
     */
    comment_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.DeleteCommentByIdPath, 'delete');
    if (params) {
      rb.path('comment_id', params.comment_id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * delete comment by id
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteCommentById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCommentById(params: {

    /**
     * comment id
     */
    comment_id: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.deleteCommentById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation editComment
   */
  static readonly EditCommentPath = '/comments/{comment_id}';

  /**
   * edit comment
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `editComment()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editComment$Response(params: {

    /**
     * comment id
     */
    comment_id: string;
    context?: HttpContext
    body: CommentPatchRequestDto
  }
): Observable<StrictHttpResponse<CommentResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.EditCommentPath, 'patch');
    if (params) {
      rb.path('comment_id', params.comment_id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CommentResponseDto>;
      })
    );
  }

  /**
   * edit comment
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `editComment$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editComment(params: {

    /**
     * comment id
     */
    comment_id: string;
    context?: HttpContext
    body: CommentPatchRequestDto
  }
): Observable<CommentResponseDto> {

    return this.editComment$Response(params).pipe(
      map((r: StrictHttpResponse<CommentResponseDto>) => r.body as CommentResponseDto)
    );
  }

  /**
   * Path part for operation getCommentsByTattooWorkId
   */
  static readonly GetCommentsByTattooWorkIdPath = '/comments/tattooworks/{tattooWork_id}';

  /**
   * get comments
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCommentsByTattooWorkId()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCommentsByTattooWorkId$Response(params: {

    /**
     * tattooWork id
     */
    tattooWork_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<CommentResponseDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetCommentsByTattooWorkIdPath, 'get');
    if (params) {
      rb.path('tattooWork_id', params.tattooWork_id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<CommentResponseDto>>;
      })
    );
  }

  /**
   * get comments
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCommentsByTattooWorkId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCommentsByTattooWorkId(params: {

    /**
     * tattooWork id
     */
    tattooWork_id: string;
    context?: HttpContext
  }
): Observable<Array<CommentResponseDto>> {

    return this.getCommentsByTattooWorkId$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CommentResponseDto>>) => r.body as Array<CommentResponseDto>)
    );
  }

  /**
   * Path part for operation createComment
   */
  static readonly CreateCommentPath = '/comments/tattooworks/{tattooWork_id}';

  /**
   * create comment
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createComment()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createComment$Response(params: {

    /**
     * tattooWork id
     */
    tattooWork_id: string;
    context?: HttpContext
    body: CommentRequestDto
  }
): Observable<StrictHttpResponse<CommentResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.CreateCommentPath, 'post');
    if (params) {
      rb.path('tattooWork_id', params.tattooWork_id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CommentResponseDto>;
      })
    );
  }

  /**
   * create comment
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createComment$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createComment(params: {

    /**
     * tattooWork id
     */
    tattooWork_id: string;
    context?: HttpContext
    body: CommentRequestDto
  }
): Observable<CommentResponseDto> {

    return this.createComment$Response(params).pipe(
      map((r: StrictHttpResponse<CommentResponseDto>) => r.body as CommentResponseDto)
    );
  }

}
