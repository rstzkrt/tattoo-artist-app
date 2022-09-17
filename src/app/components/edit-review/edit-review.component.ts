import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ReviewPatchRequestDto, ReviewPostRequestDto, ReviewType} from "../../generated-apis/review";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ReviewService} from "../../services/review.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.css']
})
export class EditReviewComponent implements OnInit {

  reviewFormGroup: FormGroup;
  reviewTypes: ReviewType[] = ["NEUTRAL", "POSITIVE", "NEGATIVE"]

  constructor(public userService: UserService,
              public authService: AuthService,
              private routeCurr: ActivatedRoute,
              private router: Router,
              private reviewService: ReviewService,
              private dialog:MatDialog) {
  }

  ngOnInit(): void {

    // this.reviewService.getReviewsById(this.dialog.)
    this.reviewFormGroup = new FormGroup({
      reviewGroup: new FormGroup({
        message:new FormControl(''),
        reviewType: new FormControl('')
      })
    })
  }

  editReview(reviewId:string){
    let reviewToUpdate: ReviewPatchRequestDto = this.reviewFormGroup.get('reviewGroup').value;

    this.authService.getCurrentUser().getIdToken(true).then(async token => {
      this.reviewService.reviewPatchUpdate(reviewId,reviewToUpdate).subscribe(data=>{
        console.log("data")
      })
    })
  }
}
