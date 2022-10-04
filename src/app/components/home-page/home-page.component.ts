import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {TattooWorksResponseDto} from "../../generated-apis/tatoo-work";
import {PageEvent} from "@angular/material/paginator";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../../common/user";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {UserDocumentDto, UserResponseDto} from "../../generated-apis/user";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  tattooWorkList: Array<TattooWorksResponseDto>
  userList: Observable<Array<UserResponseDto>>
  TattooWorkTotalElements: number = 0;
  TattooArtistTotalElements: number = 0;
  token: string
  authenticatedUser: User;
  filteredUsers:Map<string,UserDocumentDto>=new Map<string, UserDocumentDto>();

  //
  city:string
  country:string
  isTattooArtist:boolean

  //
  minPrice:number;
  maxPrice:number;
  currency:string;


  constructor(public userService: UserService,
              public authService: AuthService,
              private tattooWorkService: TattooWorkService,
              private tattooService: TattooWorkService,
              public afAuth: AngularFireAuth,
              private storageService: StorageService,
              private route:Router) {
    this.getUsers(0, 20)
    this.getTattoos(0, 20)
  }

  ngOnInit(): void {
    this.token = this.storageService.getToken()
    this.authenticatedUser = this.storageService.getUser()
  }

  private getUsers(page: number, size: number) {
     this.userService.getAllUsers(page, size).subscribe(data => {
      this.userList = of(data.tattooArtists)
      this.TattooArtistTotalElements = data.totalElements;
    })
  }

  private getTattoos(page: number, size: number) {
    this.tattooWorkService.getAllTattooWorks(page, size, 0)
      .subscribe(data => {
      this.tattooWorkList = data.tattooWorks
      this.TattooWorkTotalElements = data.totalElements;
    })
  }

  nextPageUser(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.getUsers(page, size);
  }

  nextPageTattooWork(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.getTattoos(page, size);
  }

  delete(id: string) {
    this.tattooService.deleteTattooWork(id, this.token).subscribe(data => {
      this.fetchUser()
      console.log(data)
    })
  }

  searchArtist(input:string){
    this.userService.searchUsers(input,null,null,true).subscribe(data=>{
      data.map(data => this.userService.getUserById(data.id).subscribe(data => {
        this.filteredUsers.set(data.id,data)
      }))
      this.userList = of( [...this.filteredUsers.values()]);
    })
  }

  fetchUser(): void{
    this.userService.fetchAuthenticatedUser(this.token).subscribe(user=>{
      this.storageService.saveUser(user)
      this.authenticatedUser=user
    })
  }

  likeTattooWork(id: string) {
    this.userService.likeTattooWork(id, this.token).subscribe(() => {
      this.fetchUser()
      this.getTattoos(0, 20)
      console.log("like")
    })
  }

  disLikeTattooWork(id: string) {
    this.token = this.storageService.getToken()
    this.userService.dislikeTattooWork(id, this.token).subscribe(() => {
      this.fetchUser()
      this.getTattoos(0, 20)
      console.log("dislike")
    })
  }

  favoriteTattooWork(tattoo_work_id: string) {
    this.userService.favoriteTattooWork(tattoo_work_id, this.token).subscribe(() => {
      this.fetchUser()
      this.getTattoos(0, 20)
      console.log("favorite")
    })
  }

  unFavoriteTattooWork(tattoo_work_id: string) {
    this.userService.unfavoriteTattooWork(tattoo_work_id, this.token).subscribe(() => {
      this.fetchUser()
      this.getTattoos(0, 20)
      console.log("unFavorite")
    })
  }

  favoriteTattooArtist(tattoo_artist_id: string) {
    this.userService.favoriteTattooArtist(tattoo_artist_id, this.token).subscribe(() => {
      this.fetchUser()
      // this.getUsers(0, 20)
      console.log("favorite")
    })
  }

  unFavoriteTattooArtist(tattoo_artist_id: string) {
    this.userService.unfavoriteTattooArtist(tattoo_artist_id, this.token).subscribe(() => {
      this.fetchUser()
      console.log("unFavorite")
    })
  }

  searchTattooWork(value: string) {
    this.tattooService.searchTattooWorks(value,null,null,null,null).subscribe(data=>{
      this.tattooWorkList = data;
    })
  }
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }
}
