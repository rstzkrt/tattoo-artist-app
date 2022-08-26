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

import { ClientReqDto } from '../models/client-req-dto';
import { TattooArtistAccReqDto } from '../models/tattoo-artist-acc-req-dto';
import { TattooArtistPriceInterval } from '../models/tattoo-artist-price-interval';
import { UserResponseDto } from '../models/user-response-dto';
import { UserUpdateRequestDto } from '../models/user-update-request-dto';

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
   * Path part for operation getAllUsers
   */
  static readonly GetAllUsersPath = '/users';

  /**
   * get users
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllUsers$Response(params?: {

    /**
     * user firstname
     */
    firstName?: string;

    /**
     * user lastname
     */
    lastName?: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<UserResponseDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetAllUsersPath, 'get');
    if (params) {
      rb.query('firstName', params.firstName, {});
      rb.query('lastName', params.lastName, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<UserResponseDto>>;
      })
    );
  }

  /**
   * get users
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAllUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllUsers(params?: {

    /**
     * user firstname
     */
    firstName?: string;

    /**
     * user lastname
     */
    lastName?: string;
    context?: HttpContext
  }
): Observable<Array<UserResponseDto>> {

    return this.getAllUsers$Response(params).pipe(
      map((r: StrictHttpResponse<Array<UserResponseDto>>) => r.body as Array<UserResponseDto>)
    );
  }

  /**
   * Path part for operation createUser
   */
  static readonly CreateUserPath = '/users';

  /**
   * add user
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createUser$Response(params: {
    context?: HttpContext
    body: ClientReqDto
  }
): Observable<StrictHttpResponse<UserResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.CreateUserPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResponseDto>;
      })
    );
  }

  /**
   * add user
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createUser(params: {
    context?: HttpContext
    body: ClientReqDto
  }
): Observable<UserResponseDto> {

    return this.createUser$Response(params).pipe(
      map((r: StrictHttpResponse<UserResponseDto>) => r.body as UserResponseDto)
    );
  }

  /**
   * Path part for operation getUserById
   */
  static readonly GetUserByIdPath = '/users/{id}';

  /**
   * get user
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserById$Response(params: {

    /**
     * user id
     */
    id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<UserResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetUserByIdPath, 'get');
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
        return r as StrictHttpResponse<UserResponseDto>;
      })
    );
  }

  /**
   * get user
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserById(params: {

    /**
     * user id
     */
    id: string;
    context?: HttpContext
  }
): Observable<UserResponseDto> {

    return this.getUserById$Response(params).pipe(
      map((r: StrictHttpResponse<UserResponseDto>) => r.body as UserResponseDto)
    );
  }

  /**
   * Path part for operation getAuthenticatedUser
   */
  static readonly GetAuthenticatedUserPath = '/users/me';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAuthenticatedUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAuthenticatedUser$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<UserResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.GetAuthenticatedUserPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResponseDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAuthenticatedUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAuthenticatedUser(params?: {
    context?: HttpContext
  }
): Observable<UserResponseDto> {

    return this.getAuthenticatedUser$Response(params).pipe(
      map((r: StrictHttpResponse<UserResponseDto>) => r.body as UserResponseDto)
    );
  }

  /**
   * Path part for operation updateUser
   */
  static readonly UpdateUserPath = '/users/me';

  /**
   * update user
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateUser$Response(params: {
    context?: HttpContext
    body: UserUpdateRequestDto
  }
): Observable<StrictHttpResponse<UserResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.UpdateUserPath, 'put');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResponseDto>;
      })
    );
  }

  /**
   * update user
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateUser(params: {
    context?: HttpContext
    body: UserUpdateRequestDto
  }
): Observable<UserResponseDto> {

    return this.updateUser$Response(params).pipe(
      map((r: StrictHttpResponse<UserResponseDto>) => r.body as UserResponseDto)
    );
  }

  /**
   * Path part for operation deleteUser
   */
  static readonly DeleteUserPath = '/users/me';

  /**
   * get user
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteUser$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.DeleteUserPath, 'delete');
    if (params) {
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
   * get user
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteUser(params?: {
    context?: HttpContext
  }
): Observable<void> {

    return this.deleteUser$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation createArtistAccount
   */
  static readonly CreateArtistAccountPath = '/users/me';

  /**
   * create artist page
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createArtistAccount()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createArtistAccount$Response(params: {
    context?: HttpContext
    body: TattooArtistAccReqDto
  }
): Observable<StrictHttpResponse<UserResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.CreateArtistAccountPath, 'patch');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResponseDto>;
      })
    );
  }

  /**
   * create artist page
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createArtistAccount$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createArtistAccount(params: {
    context?: HttpContext
    body: TattooArtistAccReqDto
  }
): Observable<UserResponseDto> {

    return this.createArtistAccount$Response(params).pipe(
      map((r: StrictHttpResponse<UserResponseDto>) => r.body as UserResponseDto)
    );
  }

  /**
   * Path part for operation favoriteTattooWork
   */
  static readonly FavoriteTattooWorkPath = '/users/me/tattoo-works/{post_id}/favorites';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `favoriteTattooWork()` instead.
   *
   * This method doesn't expect any request body.
   */
  favoriteTattooWork$Response(params: {

    /**
     * tattooWork post id
     */
    post_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<UserResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FavoriteTattooWorkPath, 'put');
    if (params) {
      rb.path('post_id', params.post_id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResponseDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `favoriteTattooWork$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  favoriteTattooWork(params: {

    /**
     * tattooWork post id
     */
    post_id: string;
    context?: HttpContext
  }
): Observable<UserResponseDto> {

    return this.favoriteTattooWork$Response(params).pipe(
      map((r: StrictHttpResponse<UserResponseDto>) => r.body as UserResponseDto)
    );
  }

  /**
   * Path part for operation unfavoriteTattooWork
   */
  static readonly UnfavoriteTattooWorkPath = '/users/me/tattoo-works/{post_id}/favorites';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `unfavoriteTattooWork()` instead.
   *
   * This method doesn't expect any request body.
   */
  unfavoriteTattooWork$Response(params: {

    /**
     * tattooWork post id
     */
    post_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.UnfavoriteTattooWorkPath, 'delete');
    if (params) {
      rb.path('post_id', params.post_id, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `unfavoriteTattooWork$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  unfavoriteTattooWork(params: {

    /**
     * tattooWork post id
     */
    post_id: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.unfavoriteTattooWork$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation favoriteTattooArtist
   */
  static readonly FavoriteTattooArtistPath = '/users/me/tattoo-artists/{artist_id}/favorites';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `favoriteTattooArtist()` instead.
   *
   * This method doesn't expect any request body.
   */
  favoriteTattooArtist$Response(params: {

    /**
     * artist id
     */
    artist_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<UserResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.FavoriteTattooArtistPath, 'put');
    if (params) {
      rb.path('artist_id', params.artist_id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserResponseDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `favoriteTattooArtist$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  favoriteTattooArtist(params: {

    /**
     * artist id
     */
    artist_id: string;
    context?: HttpContext
  }
): Observable<UserResponseDto> {

    return this.favoriteTattooArtist$Response(params).pipe(
      map((r: StrictHttpResponse<UserResponseDto>) => r.body as UserResponseDto)
    );
  }

  /**
   * Path part for operation unfavoriteTattooArtist
   */
  static readonly UnfavoriteTattooArtistPath = '/users/me/tattoo-artists/{artist_id}/favorites';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `unfavoriteTattooArtist()` instead.
   *
   * This method doesn't expect any request body.
   */
  unfavoriteTattooArtist$Response(params: {

    /**
     * artist id
     */
    artist_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.UnfavoriteTattooArtistPath, 'delete');
    if (params) {
      rb.path('artist_id', params.artist_id, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `unfavoriteTattooArtist$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  unfavoriteTattooArtist(params: {

    /**
     * artist id
     */
    artist_id: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.unfavoriteTattooArtist$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation likeTattooWork
   */
  static readonly LikeTattooWorkPath = '/users/me/tattoo-works/{post_id}/likes';

  /**
   * like
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `likeTattooWork()` instead.
   *
   * This method doesn't expect any request body.
   */
  likeTattooWork$Response(params: {

    /**
     * post_id
     */
    post_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.LikeTattooWorkPath, 'put');
    if (params) {
      rb.path('post_id', params.post_id, {});
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
   * like
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `likeTattooWork$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  likeTattooWork(params: {

    /**
     * post_id
     */
    post_id: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.likeTattooWork$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation dislikeTattooWork
   */
  static readonly DislikeTattooWorkPath = '/users/me/tattoo-works/{post_id}/likes';

  /**
   * dislike
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `dislikeTattooWork()` instead.
   *
   * This method doesn't expect any request body.
   */
  dislikeTattooWork$Response(params: {

    /**
     * artist id
     */
    post_id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.DislikeTattooWorkPath, 'delete');
    if (params) {
      rb.path('post_id', params.post_id, {});
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
   * dislike
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `dislikeTattooWork$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  dislikeTattooWork(params: {

    /**
     * artist id
     */
    post_id: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.dislikeTattooWork$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation userPriceInterval
   */
  static readonly UserPriceIntervalPath = '/users/{id}/price-interval';

  /**
   * price interval
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `userPriceInterval()` instead.
   *
   * This method doesn't expect any request body.
   */
  userPriceInterval$Response(params: {

    /**
     * user id
     */
    id: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<TattooArtistPriceInterval>> {

    const rb = new RequestBuilder(this.rootUrl, ApiService.UserPriceIntervalPath, 'get');
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
        return r as StrictHttpResponse<TattooArtistPriceInterval>;
      })
    );
  }

  /**
   * price interval
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `userPriceInterval$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  userPriceInterval(params: {

    /**
     * user id
     */
    id: string;
    context?: HttpContext
  }
): Observable<TattooArtistPriceInterval> {

    return this.userPriceInterval$Response(params).pipe(
      map((r: StrictHttpResponse<TattooArtistPriceInterval>) => r.body as TattooArtistPriceInterval)
    );
  }

}
