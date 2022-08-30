import { Component, OnInit } from '@angular/core';
import {LoginDialogComponent} from "../login-dialog/login-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FirstLoginDialogComponent} from "../first-login-dialog/first-login-dialog.component";

@Component({
  selector: 'app-first-login-check-dialog',
  templateUrl: './first-login-check-dialog.component.html',
  styleUrls: ['./first-login-check-dialog.component.css']
})
export class FirstLoginCheckDialogComponent implements OnInit {

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }
  signUpDialog() {
    this.dialog.open(LoginDialogComponent);
  }
  datePickerDialog(){
    this.dialog.open(FirstLoginDialogComponent);
  }

}
