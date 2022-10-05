import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {LoginDialogComponent} from "../login-dialog/login-dialog.component";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  frmSetNewPassword = this.fb.group({
    password: [null, [Validators.required]],
    confirmPassword: [null, [Validators.required]]
  });

  constructor(private afAuth: AngularFireAuth, private fb: FormBuilder, private route: ActivatedRoute, private router: Router,private dialog:MatDialog) {}

  ngOnInit(): void {
  }

  submit(){
    const password = this.frmSetNewPassword.controls['password'].value;
    const confirmPassword = this.frmSetNewPassword.controls['confirmPassword'].value;

    if (password !== confirmPassword) {
      //err
      return;
    }
    const code = this.route.snapshot.queryParams['oobCode'];
    this.afAuth
      .confirmPasswordReset(code, password)
      .then(() => this.dialog.open(LoginDialogComponent))
      .catch(err => {
          console.log(err)
      });
  }
}
