import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {TattooArtistAccReqDto} from "../../generated-apis/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-artist-account-form',
  templateUrl: './create-artist-account-form.component.html',
  styleUrls: ['./create-artist-account-form.component.css']
})
export class CreateArtistAccountFormComponent implements OnInit {

  createArtistAccountFormGroup: FormGroup

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private route:Router) {
  }

  ngOnInit(): void {
    this.createArtistAccountFormGroup = this.formBuilder.group({
      artistAccount: this.formBuilder.group({
        phoneNumber: new FormControl('', [Validators.required, Validators.minLength(3)]),
        workDays: new FormControl('', [Validators.required, Validators.minLength(3)]),
        street: new FormControl('', [Validators.required, Validators.minLength(3)]),
        city: ['', Validators.required],
        country: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        otherInformation: ['', Validators.required],
        dateOfBirth: ['', Validators.required]
      })
    })
  }

  submit() {
    let artistAccountRequest:TattooArtistAccReqDto = this.createArtistAccountFormGroup.get('artistAccount').value;
    artistAccountRequest.workDays=null;//TODO
    this.authService.getCurrentUser().getIdToken(true).then((token) => {
        this.userService.createArtistAccount(artistAccountRequest, token).subscribe(res => {
          console.log(res)
          if(res){
            this.route.navigateByUrl("/home").then()
          }
        }, error => {
          console.error(error)
        });
      })
  }
}
