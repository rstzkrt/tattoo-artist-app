import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {TattooWorksResponseDto} from "../../generated-apis/tatoo-work";
import {PageEvent} from "@angular/material/paginator";
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../../common/user";
import {UserResponseDto} from "../../generated-apis/user";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  tattooWorkList: Array<TattooWorksResponseDto>
  userList: Observable<Array<UserResponseDto>>
  totalElements: number = 0;
  observableUser: Observable<User>;

  constructor(public userService: UserService,
              public authService: AuthService,
              private tattooWorkService: TattooWorkService,
              private tattooService: TattooWorkService,
              public afAuth: AngularFireAuth) {
  }

  async ngOnInit() {
    await this.getTattoos(0, 20)
    await this.getUsers(0, 20)
    await this.afAuth.authState.subscribe(data => {
      data.getIdToken(true).then(token => {
        this.observableUser = this.userService.fetchAuthenticatedUser(token);
      })
    })
  }

  private getUsers(page: number, size: number) {
    this.userList = this.userService.getAllUsers(page, size)
    this.userList.subscribe(data => {
      this.totalElements = data.length;
    })
  }

  private getTattoos(page: number, size: number) {
    this.tattooWorkService.getAllTattooWorks(page, size, 0).subscribe(data=>{
      this.tattooWorkList =data
      this.totalElements = data.length;
    })
  }

  nextPage(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.getTattoos(page, size);
  }

  delete(id: string) {
    this.authService.getCurrentUser().getIdToken(true).then(token => {
      this.tattooService.deleteTattooWork(id, token).subscribe(data => {
        console.log(data)
      })
    })
  }

  likeTattooWork(id: string) {
    this.authService.getCurrentUser().getIdToken(true).then(token => {
      this.userService.likeTattooWork(id, token).subscribe(() => {
        this.getTattoos(0, 20)
        console.log("like")
      })
    })
  }

  disLikeTattooWork(id: string) {
    this.authService.getCurrentUser().getIdToken(true).then(token => {
      this.userService.dislikeTattooWork(id, token).subscribe(() => {
        this.getTattoos(0, 20)
        console.log("dislike")
      })
    })
  }

  favoriteTattooWork(tattoo_work_id: string) {
    this.afAuth.authState.subscribe(data => {
      data.getIdToken(true).then(token => {
        this.userService.favoriteTattooWork(tattoo_work_id, token).subscribe(() =>{
          this.observableUser = this.userService.fetchAuthenticatedUser(token);
          console.log("favorite")
        })
      })
    })
  }

  unFavoriteTattooWork(tattoo_work_id: string) {
    this.afAuth.authState.subscribe(data => {
      data.getIdToken(true).then(token => {
        this.userService.unfavoriteTattooWork(tattoo_work_id, token).subscribe(() =>{
          this.observableUser = this.userService.fetchAuthenticatedUser(token);
          console.log("unFavorite")
        })
      })
    })
  }

  favoriteTattooArtist(tattoo_artist_id: string) {
    this.afAuth.authState.subscribe(data => {
      data.getIdToken(true).then(token => {
        this.userService.favoriteTattooArtist(tattoo_artist_id, token).subscribe(() => {
          this.observableUser = this.userService.fetchAuthenticatedUser(token);
          console.log("favorite")
        } )
      })
    })
  }

  unFavoriteTattooArtist(tattoo_artist_id: string) {
    this.afAuth.authState.subscribe(data => {
      data.getIdToken(true).then(token => {
        this.userService.unfavoriteTattooArtist(tattoo_artist_id, token).subscribe(() => {
          this.observableUser = this.userService.fetchAuthenticatedUser(token);
          console.log("unFavorite")
        })
      })
    })
  }
}
