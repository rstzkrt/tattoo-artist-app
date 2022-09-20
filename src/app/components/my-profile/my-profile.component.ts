import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {TattooArtistPriceInterval, TattooWorksResponseDto, UserResponseDto} from "../../generated-apis/user";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {User} from "../../common/user";
import {ReviewService} from "../../services/review.service";
import {StorageService} from "../../services/storage.service";
import {ReviewResponseDto} from "../../generated-apis/review";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  myTattooWorks: Observable<Array<TattooWorksResponseDto>>
  favoriteTattooWorks: Observable<Array<TattooWorksResponseDto>>
  favoriteTattooArtists: Observable<Array<UserResponseDto>>
  priceInterval: Observable<TattooArtistPriceInterval>
  authenticatedUser: User
  token: string
  myReviews: Observable<Array<ReviewResponseDto>>

  constructor(public afAuth: AngularFireAuth,
              public authService: AuthService,
              private userService: UserService,
              private tattooService: TattooWorkService,
              private router: Router,
              private reviewService: ReviewService,
              private storageService: StorageService) {
  }

  ngOnInit(): void {
    this.token = this.storageService.getToken()
    this.authenticatedUser = this.storageService.getUser()
    if (this.authenticatedUser) {
      this.priceInterval = this.userService.userPriceInterval(this.authenticatedUser.uid)
      this.favoriteTattooWorks = this.userService.getFavoriteTattooWorks(this.token)
      this.myTattooWorks = this.userService.getTattooWorks(this.token)
      this.favoriteTattooArtists = this.userService.getFavoriteTattooArtists(this.token)
      this.myReviews = this.reviewService.getAllReviewByUserId(this.authenticatedUser.id)
    }
  }

  deleteTattooWork(id: string) {
    this.tattooService.deleteTattooWork(id, this.token).subscribe(data => {
      console.log(data)
    })
  }

  deleteAccount() {
    this.userService.deleteMyAccount(this.token).subscribe(() => {
      this.authService.deleteAccount()
      this.storageService.clean()
      window.location.replace("/home")
    })
  }

  unFavoriteTattooArtist(id: string) {
    this.userService.unfavoriteTattooArtist(id, this.token).subscribe(() => console.log("unFavorite"))
  }
}
