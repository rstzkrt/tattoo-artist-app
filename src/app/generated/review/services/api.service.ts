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

import { ReviewPatchRequestDto } from '../models/review-patch-request-dto';
import { ReviewPostRequestDto } from '../models/review-post-request-dto';
import { ReviewResponseDto } from '../models/review-response-dto';

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
   * Path part for operation getReviewsById
   */
  static readonly GetReviewsByIdPath = '/reviews/{id}';

  /**
   * get revie
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getReviewsById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReviewsById$Response(params: {

    /**
     * reviewId
     */
    id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<ReviewResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetReviewsByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ReviewResponseDto>;
      })
    );
  }

  /**
   * get revie
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getReviewsById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReviewsById(params: {

    /**
     * reviewId
     */
    id: string;
    context?: HttpContext
  }
): Observable<ReviewResponseDto> {

    return this.getReviewsById$Response(params).pipe(
      map((r: StrictHttpResponse<ReviewResponseDto>) => r.body as ReviewResponseDto)
    );
  }

  /**
   * Path part for operation deleteReviewById
   */
  static readonly DeleteReviewByIdPath = '/reviews/{id}';

  /**
   * delete review
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteReviewById()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteReviewById$Response(params: {

    /**
     * reviewId
     */
    id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.DeleteReviewByIdPath, 'delete');
    if (params) {
      rb.path('id', params.id, {});
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
   * delete review
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteReviewById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteReviewById(params: {

    /**
     * reviewId
     */
    id: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.deleteReviewById$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation reviewPatchUpdate
   */
  static readonly ReviewPatchUpdatePath = '/reviews/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reviewPatchUpdate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  reviewPatchUpdate$Response(params: {

    /**
     * reviewId
     */
    id: string;
    context?: HttpContext
    body: ReviewPatchRequestDto
  }
): Observable<StrictHttpResponse<ReviewResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.ReviewPatchUpdatePath, 'patch');
    if (params) {
      rb.path('id', params.id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ReviewResponseDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `reviewPatchUpdate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  reviewPatchUpdate(params: {

    /**
     * reviewId
     */
    id: string;
    context?: HttpContext
    body: ReviewPatchRequestDto
  }
): Observable<ReviewResponseDto> {

    return this.reviewPatchUpdate$Response(params).pipe(
      map((r: StrictHttpResponse<ReviewResponseDto>) => r.body as ReviewResponseDto)
    );
  }

  /**
   * Path part for operation getAllReviewByUserId
   */
  static readonly GetAllReviewByUserIdPath = '/reviews/users/{receiver_id}';

  /**
   * get all
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllReviewByUserId()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllReviewByUserId$Response(params: {

    /**
     * receiverId
     */
    receiver_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ReviewResponseDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetAllReviewByUserIdPath, 'get');
    if (params) {
      rb.path('receiver_id', params.receiver_id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ReviewResponseDto>>;
      })
    );
  }

  /**
   * get all
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAllReviewByUserId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllReviewByUserId(params: {

    /**
     * receiverId
     */
    receiver_id: string;
    context?: HttpContext
  }
): Observable<Array<ReviewResponseDto>> {

    return this.getAllReviewByUserId$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ReviewResponseDto>>) => r.body as Array<ReviewResponseDto>)
    );
  }

  /**
   * Path part for operation createReview
   */
  static readonly CreateReviewPath = '/reviews/users/{receiver_id}';

  /**
   * post review for tattooArtist
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createReview()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createReview$Response(params: {

    /**
     * receiverId
     */
    receiver_id: string;
    context?: HttpContext
    body: ReviewPostRequestDto
  }
): Observable<StrictHttpResponse<ReviewResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.CreateReviewPath, 'post');
    if (params) {
      rb.path('receiver_id', params.receiver_id, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ReviewResponseDto>;
      })
    );
  }

  /**
   * post review for tattooArtist
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createReview$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createReview(params: {

    /**
     * receiverId
     */
    receiver_id: string;
    context?: HttpContext
    body: ReviewPostRequestDto
  }
): Observable<ReviewResponseDto> {

    return this.createReview$Response(params).pipe(
      map((r: StrictHttpResponse<ReviewResponseDto>) => r.body as ReviewResponseDto)
    );
  }

}
