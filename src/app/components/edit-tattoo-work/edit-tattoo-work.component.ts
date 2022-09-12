import {Component, OnInit} from '@angular/core';
import {TattooWorkService} from "../../services/tattoo-work.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TattooWorkPatchRequestDto, TattooWorkPostRequestDto} from "../../generated-apis/tatoo-work";
import {idToken} from "@angular/fire/auth";

@Component({
  selector: 'app-edit-tattoo-work',
  templateUrl: './edit-tattoo-work.component.html',
  styleUrls: ['./edit-tattoo-work.component.css']
})
export class EditTattooWorkComponent implements OnInit {

  tattooWorkId: string
  patchTattooWorkFormGroup: FormGroup
  constructor(private tattooService: TattooWorkService,
              private router: ActivatedRoute,
              private authService: AuthService,
              private formBuilder: FormBuilder) {
    this.tattooWorkId = this.router.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    this.tattooService.getTattooWorkById(this.tattooWorkId).subscribe(tattooWork=>{
      this.patchTattooWorkFormGroup = new FormGroup({
        patchTattooWork: new FormGroup({
          price: new FormControl(tattooWork.price),
          currency: new FormControl(tattooWork.currency),
          coverPhoto: new FormControl(tattooWork.coverPhoto),
          description: new FormControl(tattooWork.description)
        })
      })
    })
  }

  update() {
    let tattooWorkPatch: TattooWorkPatchRequestDto = this.patchTattooWorkFormGroup.get('patchTattooWork').value;
    console.log(tattooWorkPatch)
    tattooWorkPatch.photos=[]
    this.authService.getCurrentUser().getIdToken().then(token => {
      this.tattooService.patchTattooWork(this.tattooWorkId, tattooWorkPatch, token).subscribe(data => {
        console.log(data)
      })
    })
  }
}
