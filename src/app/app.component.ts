import { Component } from '@angular/core';
import {UserService} from "./services/user.service";
import {AuthService} from "./services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {LoginDialogComponent} from "./components/login-dialog/login-dialog.component";
import {FirstLoginCheckDialogComponent} from "./components/first-login-check-dialog/first-login-check-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'untitled';
  constructor(public userService:UserService, public authService:AuthService,public dialog: MatDialog) {
  }

  signUpDialog() {
    this.dialog.open(LoginDialogComponent);
  }

  firstLoginCheckDialog() {
    this.dialog.open(FirstLoginCheckDialogComponent);
  }

}
