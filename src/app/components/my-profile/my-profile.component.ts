import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {TattooWorksResponseDto, UserResponseDto} from "../../generated-apis/user";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {TattooArtistPriceInterval} from "../../generated/user/models/tattoo-artist-price-interval";
import {User} from "../../common/user";
import {ReviewService} from "../../services/review.service";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  myTattooWorks: Array<TattooWorksResponseDto>
  favoriteTattooWorks: Array<TattooWorksResponseDto>
  favoriteTattooArtists: Array<UserResponseDto>
  priceInterval: Observable<TattooArtistPriceInterval>
  user: Observable<User>
  authenticatedUser:User

  constructor(public afAuth: AngularFireAuth,
              public authService: AuthService,
              private userService: UserService,
              private tattooService: TattooWorkService,
              private router: Router,
              private reviewService:ReviewService) {
  }

  async ngOnInit() {
    await this.authService.getCurrentUser().getIdToken(true).then(async token => {
      await this.userService.getFavoriteTattooWorks(token).subscribe(data =>{
        this.favoriteTattooWorks = data
      })
      await this.userService.getTattooWorks(token).subscribe(data => {
        this.myTattooWorks = data
      })
      await this.userService.getFavoriteTattooArtists(token).subscribe(data => {
        this.favoriteTattooArtists = data
      })
      await this.userService.fetchAuthenticatedUser(token).subscribe(async user => {
        this.authenticatedUser=user
      })
    })
    this.priceInterval = this.userService.userPriceInterval(this.authService.getCurrentUser().uid)
  }

  deleteTattooWork(id: string) {
    this.authService.getCurrentUser().getIdToken(true).then(token => {
      this.tattooService.deleteTattooWork(id, token).subscribe(data => {
        console.log(data)
      })
    })
  }

  deleteAccount() {
    this.authService.getCurrentUser().getIdToken(true).then(token => {
      this.userService.deleteMyAccount(token).subscribe(() => {
        this.authService.deleteAccount()
        this.router.navigateByUrl('/home').then()
      })
    })
  }

  unFavoriteTattooArtist(id: string) {
    this.afAuth.authState.subscribe(data => {
      data.getIdToken(true).then(token => {
        this.userService.unfavoriteTattooArtist(id, token).subscribe(() => console.log("unFavorite"))
      })
    })
  }
}
