import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  emailSignUpFormGroup: FormGroup;

  constructor(public authService:AuthService,private dialog:MatDialog) { }

  ngOnInit(): void {
  }


  submit() {

  }
}
