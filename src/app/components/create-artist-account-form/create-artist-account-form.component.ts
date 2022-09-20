import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {TattooArtistAccReqDto, WorkingDays} from "../../generated-apis/user";
import {Router} from "@angular/router";
import {User} from "../../common/user";
import {StorageService} from "../../services/storage.service";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-create-artist-account-form',
  templateUrl: './create-artist-account-form.component.html',
  styleUrls: ['./create-artist-account-form.component.css']
})
export class CreateArtistAccountFormComponent implements OnInit {

  createArtistAccountFormGroup: FormGroup
  days: WorkingDays[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
  authenticatedUser: User
  token: string

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private route: Router,
              private storageService: StorageService) {
  }

  ngOnInit(): void {
    this.token = this.storageService.getToken()
    this.authenticatedUser = this.storageService.getUser()
    this.createArtistAccountFormGroup = this.formBuilder.group({
      artistAccount: this.formBuilder.group({
        phoneNumber: new FormControl('', [Validators.required, Validators.minLength(3)]),
        workDays: new FormControl('', [Validators.required, Validators.minLength(3)]),
        street: new FormControl('', [Validators.required, Validators.minLength(3)]),
        city: new FormControl('', [Validators.required, Validators.minLength(3)]),
        country: new FormControl('', [Validators.required, Validators.minLength(3)]),
        state: new FormControl('', [Validators.required, Validators.minLength(3)]),
        postalCode: new FormControl('', [Validators.required, Validators.minLength(3)]),
        otherInformation: new FormControl('', [Validators.required, Validators.minLength(3)]),
        dateOfBirth: new FormControl('', [Validators.required, Validators.minLength(3)])
      })
    })
  }

  submit() {
    let artistAccountRequest:TattooArtistAccReqDto = this.createArtistAccountFormGroup.get('artistAccount').value;
        this.userService.createArtistAccount(artistAccountRequest, this.token).subscribe(res => {
          console.log(res)
          this.storageService.saveUser(user)
          this.authenticatedUser = res
          if(res){
            this.route.navigateByUrl("/home").then()
          }
        }, error => {
          console.error(error)
        });

  }
}
