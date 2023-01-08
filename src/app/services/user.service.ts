import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../common/user";
import {
  ClientReqDto,
  DefaultService, Gender,
  TattooArtistAccReqDto, TattooArtistPriceInterval,
  TattooWorksResponseDto, UserDocumentDto,
  UserResponseDto, UserResponseDtoPageable,
  UserUpdateRequestDto
} from "../generated-apis/user";

@Injectable({
  providedIn: 'root'
})

export class UserService{

  private _rootUrl: string="http://tattoo-api.us-east-1.elasticbeanstalk.com";
  // private _rootUrl: string="http://localhost:8080";

  constructor(private httpClient:HttpClient, private userOpenApiService:DefaultService) {
    userOpenApiService.configuration.basePath=this._rootUrl;
  }
  createClient(clientReqDto:ClientReqDto):Observable<UserResponseDto> {
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

  getTattooWorks(token:string) : Observable<Array<TattooWorksResponseDto>>{
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.getTattooWorks();

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

  searchUsers(query:string,page:number,size:number, city?:string,country?:string ,isTattooArtist?:boolean,averageRating?:number,languages?:string[],gender?:Gender): Observable<UserResponseDtoPageable> {
    return this.userOpenApiService.searchUsers(query,page,size,city,country,isTattooArtist,averageRating,languages,gender)
  }

  getAllUsers(page: number,size: number,firstName?: string, lastName?: string): Observable<UserResponseDtoPageable> {
    return this.userOpenApiService.getAllUsers(page,size,firstName,lastName)
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

  getFavoriteTattooWorks(token:string): Observable<TattooWorksResponseDto[]>{
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.getFavoriteTattooWorks();
  }

  getFavoriteTattooArtists(token:string): Observable<UserResponseDto[]>{
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.getFavoriteTattooArtists();
  }
  deleteById(id:string,token:string){
    this.userOpenApiService.configuration.credentials= {"bearerAuth": token};
    return this.userOpenApiService.deleteUser(id);

  }
}
