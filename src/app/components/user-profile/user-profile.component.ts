import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {User} from "../../common/user";
import {StreamChat} from "stream-chat";
import {ReviewPatchRequestDto, ReviewPostRequestDto, ReviewResponseDto, ReviewType} from "../../generated-apis/review";
import {ReviewService} from "../../services/review.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TattooWorksResponseDto} from "../../generated-apis/tatoo-work";
import {PageEvent} from "@angular/material/paginator";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {StorageService} from "../../services/storage.service";
import {UserReportService} from "../../services/user-report.service";
import {UserReportPostReqDto} from "../../generated-apis/user-report";
import {TattooWorkReportPost} from "../../common/tattooWorkReportPost";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User = new User();
  observableUser: Observable<User>;
  userReviews: ReviewResponseDto[]
  reviewTypes: ReviewType[] = ["NEUTRAL", "POSITIVE", "NEGATIVE"]
  reviewFormGroup: FormGroup;
  target_uid: string
  totalElements: number = 0;
  tattooWorkList: Array<TattooWorksResponseDto>
  isClicked: boolean = false;
  reviewUpdateFormGroup: FormGroup;
  authenticatedUser: User
  token: string
  isReportClicked: boolean = true;
  reportFormGroup: FormGroup;

  constructor(public userService: UserService,
              public authService: AuthService,
              private routeCurr: ActivatedRoute,
              private router: Router,
              private reviewService: ReviewService,
              private dialog: MatDialog,
              private afAuth: AngularFireAuth,
              private tattooWorkService: TattooWorkService,
              private storageService: StorageService,
              private userReportService: UserReportService
  ) {
    this.target_uid = this.routeCurr.snapshot.paramMap.get('id')
    userService.getUserById(this.target_uid).subscribe(user => {
      this.user = user;
    });
    this.reportFormGroup = new FormGroup({
      reportGroup: new FormGroup({
        description: new FormControl('')
      })
    })
  }

  ngOnInit(): void {
    this.token = this.storageService.getToken()
    console.log(this.token)
    this.authenticatedUser = this.storageService.getUser()
    console.log(this.authenticatedUser.userReports)
    this.getTattoos(0, 20)
    this.reviewService.getAllReviewByUserId(this.target_uid).subscribe(data => {
      this.userReviews = data
      this.reviewFormGroup = new FormGroup({
        reviewGroup: new FormGroup({
          message: new FormControl(''),
          reviewType: new FormControl('')
        })
      })
    })

  }

  private getTattoos(page: number, size: number) {
    this.tattooWorkService.getAllTattooWorks(page, size, 0).subscribe(data => {
      this.tattooWorkList = data.tattooWorks.filter(tattooWork => tattooWork.madeBy.id === this.target_uid)
      this.totalElements = data.totalElements;
    })
  }

  nextPage(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.getTattoos(page, size);
  }

  likeTattooWork(id: string) {
    this.userService.likeTattooWork(id, this.token).subscribe(() => {
      this.getTattoos(0, 20)
      console.log("like")
    })
  }

  disLikeTattooWork(id: string) {
    this.userService.dislikeTattooWork(id, this.token).subscribe(() => {
      this.getTattoos(0, 20)
      console.log("dislike")
    })
  }

  favoriteTattooWork(tattoo_work_id: string) {
    this.userService.favoriteTattooWork(tattoo_work_id, this.token).subscribe(() => {
      this.observableUser = this.userService.fetchAuthenticatedUser(this.token);
      console.log("favorite")
    })
  }

  unFavoriteTattooWork(tattoo_work_id: string) {
    this.userService.unfavoriteTattooWork(tattoo_work_id, this.token).subscribe(() => {
      this.observableUser = this.userService.fetchAuthenticatedUser(this.token);
      console.log("unFavorite")
    })
  }

  async handleSendMessage() {
    this.authService.getStreamToken().subscribe(async data => {
      const chatClient = StreamChat.getInstance(environment.stream.key);
      await chatClient.connectUser(
        {
          id: this.authService.authenticatedUser.uid,
          name: this.authService.authenticatedUser.firstName + " " + this.authService.authenticatedUser.lastName,
          image: this.authService.authenticatedUser.avatarUrl,
        },
        data,);
      const target_uuid: string = this.routeCurr.snapshot.paramMap.get('id')
      this.userService.getUserById(target_uuid).subscribe(async receiverUser => {
        const filter = {type: 'messaging', members: {$in: [this.authService.getCurrentUser().uid]}};
        const client = StreamChat.getInstance(environment.stream.key);
        const channels = await client.queryChannels(filter, {last_message_at: -1}, {
          watch: false,
          state: true
        });
        const check = channels.filter(c => {
          let members = c.state.members
          return members[receiverUser.uid] !== undefined
        })
        if (check.length === 0) {
          const channel = client.channel('messaging', {members: [this.authService.getCurrentUser().uid, receiverUser.uid]});
          await channel.create();
          await this.router.navigateByUrl("/chats/" + channel.id)
        } else {
          await this.router.navigateByUrl("/chats/" + check[0].id)
        }
      });
    });
  }

  submit() {
    let review: ReviewPostRequestDto = this.reviewFormGroup.get('reviewGroup').value;
    review.postedBy = this.authService.authenticatedUser.id
    this.reviewService.createReview(this.target_uid, review).subscribe(data => {
      console.log(data)
      this.userReviews.push(data)
    })
  }

  deleteReview(id: string) {
    this.reviewService.deleteReviewById(id, this.token).subscribe(() => {
      console.log("deletedReview")
      this.userReviews = this.userReviews.filter(rev => rev.id !== id)
    })
  }

  openEditComponent(id: string) {
    this.reviewService.getReviewsById(id).subscribe(review => {
      this.reviewUpdateFormGroup = new FormGroup({
        reviewUpdateGroup: new FormGroup({
          message: new FormControl(review.message),
          reviewType: new FormControl(review.reviewType)
        })
      })
    })
    this.isClicked = !this.isClicked;
  }

  editReview(id: string) {
    let reviewToUpdate: ReviewPatchRequestDto = this.reviewUpdateFormGroup.get('reviewUpdateGroup').value;
    this.reviewService.reviewPatchUpdate(id, reviewToUpdate, this.token).subscribe(data => {
      console.log(data)
      this.reviewService.getAllReviewByUserId(this.target_uid).subscribe(data => {
        this.userReviews = data
      })
    })
    this.isClicked = !this.isClicked;
  }

  reportUser(id: string) {
    let authenticatedUserId = this.storageService.getUser().id;
    let userReport: UserReportPostReqDto = this.reportFormGroup.get('reportGroup').value;
    userReport.reportedUserId= id;
    userReport.reportOwnerId=authenticatedUserId;
    this.userReportService.createUserReport(userReport, this.storageService.getToken()).subscribe(data => {
      console.log(data)
      this.userService.fetchAuthenticatedUser(this.storageService.getToken()).subscribe(user=>{
        this.storageService.saveUser(user)
        this.isReportClicked = !this.isReportClicked
      })
    })

  }

  handleReport() {
    this.isReportClicked = !this.isReportClicked
  }

}
