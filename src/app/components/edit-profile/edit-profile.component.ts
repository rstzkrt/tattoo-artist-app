import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserUpdateRequestDto, WorkingDays} from "../../generated-apis/user";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../common/user";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  updateProfileFormGroup: FormGroup
  days: WorkingDays[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
  authenticatedUser: User
  token: string

  constructor(private userService: UserService,
              private aRouter: ActivatedRoute,
              private authService: AuthService,
              private afAuth: AngularFireAuth,
              private dialog: MatDialog,
              private router: Router,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.token = this.storageService.getToken()
    this.userService.fetchAuthenticatedUser(this.token).subscribe(user => {
      this.updateProfileFormGroup = new FormGroup({
        updateProfile: new FormGroup({
          firstName: new FormControl(user.firstName),
          lastName: new FormControl(user.lastName),
          birthDate: new FormControl(new Date(user.birthDate)),
          avatarUrl: new FormControl(user.avatarUrl),
          phoneNumber: new FormControl(user.phoneNumber),
          workDays: new FormControl(user.workDays),
          email: new FormControl(user.email),
          street: new FormControl(user.street),
          city: new FormControl(user.city),
          country: new FormControl(user.country),
          state: new FormControl(user.state),
          postalCode: new FormControl(user.postalCode),
          otherInformation: new FormControl(user.otherInformation)
        })
      })
    })
  }

  submit() {
    let userUpdate: UserUpdateRequestDto = this.updateProfileFormGroup.get('updateProfile').value;
    this.userService.updateMe(userUpdate, this.token).subscribe(data => {
     this.storageService.saveUser(data)
      this.authenticatedUser=this.storageService.getUser()
      if (data) {
        this.router.navigateByUrl('/me').then(r => console.log("updated"))
      }
    })
  }
}
