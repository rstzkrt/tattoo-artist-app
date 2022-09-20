import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {StorageService} from "./services/storage.service";
import {User} from "./common/user";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'untitled';
  isLoggedIn = false;
   token: string;
   authenticatedUser: User;

  constructor(public authService:AuthService,
               public afAuth:AngularFireAuth,
               private storageService:StorageService,
              private userService:UserService ) {
  }
  ngOnInit() : void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.token = this.storageService.getToken()
    this.authenticatedUser = this.storageService.getUser()
    this.userService.fetchAuthenticatedUser(this.token).subscribe(user=>{
      this.storageService.saveUser(user)
      this.authenticatedUser=user
    })
  }
}
