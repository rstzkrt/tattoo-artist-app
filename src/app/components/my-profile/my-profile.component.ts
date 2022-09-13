import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {TattooWorksResponseDto} from "../../generated-apis/user";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  myTattooWorks: Array<TattooWorksResponseDto>

  constructor(public afAuth: AngularFireAuth,
              public authService: AuthService,
              private userService: UserService,
              private tattooService: TattooWorkService,
              private router: Router) {
    this.authService.getCurrentUser().getIdToken(true).then(token => {
      this.userService.getTattooWorks(token).subscribe(data => {
        this.myTattooWorks = data
        console.log(data)
      })
    })

  }

  ngOnInit(): void {

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
}
