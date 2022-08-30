import { Injectable } from '@angular/core';
import {DefaultService, ReviewPatchRequestDto, ReviewPostRequestDto, ReviewResponseDto} from "../generated-apis/review";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReviewService{

  private _rootUrl: string="http://localhost:8080";

  constructor( private reviewService :DefaultService) {
    reviewService.configuration.basePath=this._rootUrl;
  }

  createReview(receiverId: string, reviewPostRequestDto: ReviewPostRequestDto): Observable<ReviewResponseDto> {
    return this.reviewService.createReview(receiverId,reviewPostRequestDto);
  }

  deleteReviewById(id: string): Observable<any> {
    return this.reviewService.deleteReviewById(id)
  }

  getAllReviewByUserId(receiverId: string): Observable<Array<ReviewResponseDto>> {
    return this.reviewService.getAllReviewByUserId(receiverId);
  }

  getReviewsById(id: string): Observable<ReviewResponseDto> {
    return this.reviewService.getReviewsById(id)
  }

  reviewPatchUpdate(id: string, reviewPatchRequestDto: ReviewPatchRequestDto): Observable<ReviewResponseDto> {
    return this.reviewService.reviewPatchUpdate(id,reviewPatchRequestDto)
  }
}
