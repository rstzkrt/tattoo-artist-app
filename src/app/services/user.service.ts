import { Injectable } from '@angular/core';
import {HttpClient, HttpContext, HttpContextToken} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserResponseDto} from "../generated/user/models/user-response-dto";
import {ApiService} from "../generated/user/services/api.service";
import {TattooArtistAccReqDto} from "../generated/user/models/tattoo-artist-acc-req-dto";
import {ClientReqDto} from "../generated/user/models/client-req-dto";
import {UserUpdateRequestDto} from "../generated/user/models/user-update-request-dto";
import {TattooArtistPriceInterval} from "../generated/user/models/tattoo-artist-price-interval";
import {User} from "../common/user";

@Injectable({
  providedIn: 'root'
})

export class UserService{

  private _rootUrl: string="http://localhost:8080";


  constructor(private httpClient:HttpClient, private userOpenApiService:ApiService) {
    this.userOpenApiService.rootUrl=this._rootUrl;
  }

  registerClient(request:ClientReqDto):Observable<UserResponseDto> {
    const body=JSON.stringify(request);

    // @ts-ignore
    return this.userOpenApiService.createUser({ context: null, body: body })
  }

  fetchAuthenticatedUser(token:string) : Observable<User>{
    // const context: HttpContext=new HttpContext();
    // const AUTHORIZATION = new HttpContextToken(() => token);
    // context.set(AUTHORIZATION,token)
    // console.log(AUTHORIZATION.defaultValue())
    // console.log(context)
    //
    // return this.userOpenApiService.getAuthenticatedUser();
    const headers = { 'content-type': 'application/json','Authorization': `Bearer ${token}` };
    return this.httpClient.get<User>(`${this._rootUrl}/users/me`,{'headers': headers});
  }

  getUserById(id:String): Observable<UserResponseDto> {
    // @ts-ignore
    return this.userOpenApiService.getUserById({id: id, context: null})
      .subscribe(res=>console.log(res),error => console.log(error));
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
