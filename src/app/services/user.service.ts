import { Injectable } from '@angular/core';
import {HttpClient, HttpContext} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserResponseDto} from "../generated/user/models/user-response-dto";
import {TattooArtistAccReqDto} from "../generated/user/models/tattoo-artist-acc-req-dto";
import {ClientReqDto} from "../generated/user/models/client-req-dto";
import {UserUpdateRequestDto} from "../generated/user/models/user-update-request-dto";
import {TattooArtistPriceInterval} from "../generated/user/models/tattoo-artist-price-interval";
import {User} from "../common/user";
import {DefaultService} from "../generated-apis/user";

@Injectable({
  providedIn: 'root'
})

export class UserService{

  private _rootUrl: string="http://localhost:8080";

  constructor(private httpClient:HttpClient, private userOpenApiService:DefaultService) {
    userOpenApiService.configuration.basePath=this._rootUrl;
  }
  registerClient(clientReqDto:ClientReqDto):Observable<UserResponseDto> {
    return this.userOpenApiService.createUser(clientReqDto);
  }

  fetchAuthenticatedUser(token:string) : Observable<User>{
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.getAuthenticatedUser();
  }

  getUserById(id:string): Observable<UserResponseDto> {
    return this.userOpenApiService.getUserById(id);
  }

  createArtistAccount(params: { context?: HttpContext; body: TattooArtistAccReqDto }): Observable<User> {
    return new Observable<UserResponseDto>()
  }

  createUser(params: { context?: HttpContext; body: ClientReqDto }): Observable<UserResponseDto> {
    return new Observable<UserResponseDto>();
  }

  deleteUser(params?: { context?: HttpContext }): Observable<void> {
    return new Observable<void>();
  }

  dislikeTattooWork(params: { post_id: string; context?: HttpContext }): Observable<void> {
    return new Observable<void>();
  }

  favoriteTattooArtist(params: { artist_id: string; context?: HttpContext }): Observable<UserResponseDto> {
    return new Observable<UserResponseDto>();
  }

  favoriteTattooWork(params: { post_id: string; context?: HttpContext }): Observable<UserResponseDto> {
    return new Observable();
  }

  getAllUsers(params?: { firstName?: string; lastName?: string; context?: HttpContext }): Observable<Array<UserResponseDto>> {
    return new Observable();
  }

  likeTattooWork(params: { post_id: string; context?: HttpContext }): Observable<void> {
    return new Observable();
  }

  unfavoriteTattooArtist(params: { artist_id: string; context?: HttpContext }): Observable<void> {
    return new Observable();
  }

  unfavoriteTattooWork(params: { post_id: string; context?: HttpContext }): Observable<void> {
    return new Observable();
  }

  updateUser(params: { context?: HttpContext; body: UserUpdateRequestDto }): Observable<UserResponseDto> {
    return new Observable();
  }

  userPriceInterval(params: { id: string; context?: HttpContext }): Observable<TattooArtistPriceInterval> {
    return new Observable<TattooArtistPriceInterval>();
  }

  get rootUrl(): string {
    return "";
  }

}
