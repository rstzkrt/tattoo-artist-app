import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserUpdateRequestDto, WorkingDays} from "../../generated-apis/user";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  updateProfileFormGroup:FormGroup
  days: WorkingDays[]=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"]

  constructor(private userService: UserService,
              private aRouter: ActivatedRoute,
              private authService: AuthService,
              private afAuth:AngularFireAuth,
              private dialog:MatDialog,
              private router:Router) {
  }
   ngOnInit() {
     this.afAuth.authState.subscribe(user => {
       user.getIdToken(true).then(token=>{
         this.userService.fetchAuthenticatedUser(token).subscribe( user => {
           this.updateProfileFormGroup = new FormGroup({
             updateProfile: new FormGroup({
               firstName: new FormControl(user.firstName),
               lastName: new FormControl(user.lastName),
               birthDate: new FormControl(user.birthDate),
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
       })
    })
  }

  submit() {
    let userUpdate: UserUpdateRequestDto = this.updateProfileFormGroup.get('updateProfile').value;
    this.authService.getCurrentUser().getIdToken().then(token => {
      this.userService.updateMe(userUpdate,token).subscribe(data => {
        console.log(data)
        if (data){
          this.router.navigateByUrl('/me').then(r => console.log("updated") )
        }
      })
    })
  }
}
