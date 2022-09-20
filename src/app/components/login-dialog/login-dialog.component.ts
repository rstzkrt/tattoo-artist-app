import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  emailSignUpFormGroup: FormGroup
  loginFormGroup: FormGroup;

  constructor(public authService:AuthService,
              private userService:UserService,
              private dialog:MatDialog,
              private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      emailLoginForm: this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      })
    })

    this.emailSignUpFormGroup = this.formBuilder.group({
      emailRegisterForm: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required]
      })
    })
  }

  submit() {

      let user:EmailLoginReq = this.emailSignUpFormGroup.get('emailRegisterForm').value;
      this.authService.singUpWithEmail(user)
        .then()
        .catch(err=>console.log(err))

  }

  signIn() {
    let login:Login = this.loginFormGroup.get('emailLoginForm').value;
    this.authService.singInWithEmail(login)
      .then()
      .catch(err=>console.log(err))
  }
}

export interface EmailLoginReq {
  uid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?:string
}
export interface Login {
  email?: string;
  password?:string
}
