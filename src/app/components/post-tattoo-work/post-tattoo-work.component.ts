import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TattooWorkPostRequestDto} from "../../generated-apis/tatoo-work";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {TattooWorkService} from "../../services/tattoo-work.service";

@Component({
  selector: 'app-post-tattoo-work',
  templateUrl: './post-tattoo-work.component.html',
  styleUrls: ['./post-tattoo-work.component.css']
})
export class PostTattooWorkComponent implements OnInit {

  postTattooWorkFormGroup: FormGroup

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private tattooWorkService: TattooWorkService,
              private route:Router) { }

  ngOnInit(): void {
    this.postTattooWorkFormGroup = this.formBuilder.group({
      postTattooWork: this.formBuilder.group({
        price: new FormControl(''),
        currency: new FormControl(''),
        coverPhoto: new FormControl(''),
        description: ['', Validators.required],
        clientId: ['', Validators.required],
      })
    })
  }

  submit() {
    let tattooWork:TattooWorkPostRequestDto = this.postTattooWorkFormGroup.get('postTattooWork').value;
    // tattooWork.madeById=this.authService.authenticatedUser.id
    this.authService.getCurrentUser().getIdToken(true).then((token) => {
      this.tattooWorkService.createTattooWork(tattooWork, token).subscribe(res => {
        console.log(res)
        if(res){
          this.route.navigateByUrl("/me").then()
        }
      }, error => {
        console.error(error)
      });
    })
  }
}
