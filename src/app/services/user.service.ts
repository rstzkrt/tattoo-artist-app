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

  createArtistAccount(tattooArtistAccReqDto: TattooArtistAccReqDto,token:string): Observable<User> {
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.createArtistAccount(tattooArtistAccReqDto);
  }

  deleteMyAccount(token:string): Observable<void> {
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.deleteMe()
  }

  dislikeTattooWork(tattoo_work_id:string,token:string): Observable<void> {
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.dislikeTattooWork(tattoo_work_id);
  }

  favoriteTattooArtist(artistId:string,token:string): Observable<UserResponseDto> {
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.favoriteTattooArtist(artistId)
  }

  favoriteTattooWork(tattoo_work_id:string,token:string): Observable<UserResponseDto> {
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.favoriteTattooWork(tattoo_work_id)
  }

  getAllUsers(firstName?: string, lastName?: string): Observable<Array<UserResponseDto>> {
    return this.userOpenApiService.getAllUsers(firstName,lastName)
  }

  likeTattooWork(tattoo_work_id:string,token:string): Observable<void> {
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.likeTattooWork(tattoo_work_id)
  }

  unfavoriteTattooArtist(tattoo_artist_id:string,token:string): Observable<void> {
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.unfavoriteTattooArtist(tattoo_artist_id)
  }

  unfavoriteTattooWork(tattooWorkId:string,token:string): Observable<void> {
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.unfavoriteTattooWork(tattooWorkId)
  }

  updateMe(userUpdateRequestDto: UserUpdateRequestDto,token:string): Observable<UserResponseDto> {
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.updateUser(userUpdateRequestDto)
  }

  userPriceInterval(user_id:string): Observable<TattooArtistPriceInterval> {
    return this.userOpenApiService.userPriceInterval(user_id)
  }

}
