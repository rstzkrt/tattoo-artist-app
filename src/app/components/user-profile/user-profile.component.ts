import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {User} from "../../common/user";
import {StreamChat} from "stream-chat";
import {ReviewPostRequestDto, ReviewResponseDto, ReviewType} from "../../generated-apis/review";
import {ReviewService} from "../../services/review.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {EditReviewComponent} from "../edit-review/edit-review.component";
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TattooWorksResponseDto} from "../../generated-apis/tatoo-work";
import {PageEvent} from "@angular/material/paginator";
import {TattooWorkService} from "../../services/tattoo-work.service";

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

  constructor(public userService: UserService,
              public authService: AuthService,
              private routeCurr: ActivatedRoute,
              private router: Router,
              private reviewService: ReviewService,
              private dialog:MatDialog,
              private afAuth:AngularFireAuth,
              private tattooWorkService:TattooWorkService) {
    this.target_uid = this.routeCurr.snapshot.paramMap.get('id')
    userService.getUserById(this.target_uid).subscribe(async user => {
      this.user = user;
    });
  }

  async ngOnInit() {
    this.getTattoos(0, 20)
    await this.afAuth.authState.subscribe(data => {
      data.getIdToken(true).then(token => {
        this.observableUser = this.userService.fetchAuthenticatedUser(token);
      })
    })
    await this.authService.getCurrentUser().getIdToken(true).then(async token => {
      await this.userService.fetchAuthenticatedUser(token).subscribe(async user => {
        await this.reviewService.getAllReviewByUserId(this.target_uid).subscribe(data => {
          this.userReviews = data
          this.reviewFormGroup = new FormGroup({
            reviewGroup: new FormGroup({
              message:new FormControl(''),
              reviewType: new FormControl('')
            })
          })
        })
      })
    })
  }

  private getTattoos(page: number, size: number) {
    this.tattooWorkService.getAllTattooWorks(page, size, 0).subscribe(data=>{
      this.tattooWorkList =data.filter(tattooWork=>tattooWork.madeBy.id===this.target_uid)
      this.totalElements = data.length;
    })
  }

  nextPage(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.getTattoos(page, size);
  }
  likeTattooWork(id: string) {
    this.authService.getCurrentUser().getIdToken(true).then(token => {
      this.userService.likeTattooWork(id, token).subscribe(() => {
        this.getTattoos(0, 20)
        console.log("like")
      })
    })
  }

  disLikeTattooWork(id: string) {
    this.authService.getCurrentUser().getIdToken(true).then(token => {
      this.userService.dislikeTattooWork(id, token).subscribe(() => {
        this.getTattoos(0, 20)
        console.log("dislike")
      })
    })
  }

  favoriteTattooWork(tattoo_work_id: string) {
    this.afAuth.authState.subscribe(data => {
      data.getIdToken(true).then(token => {
        this.userService.favoriteTattooWork(tattoo_work_id, token).subscribe(() =>{
          this.observableUser = this.userService.fetchAuthenticatedUser(token);
          console.log("favorite")
        })
      })
    })
  }

  unFavoriteTattooWork(tattoo_work_id: string) {
    this.afAuth.authState.subscribe(data => {
      data.getIdToken(true).then(token => {
        this.userService.unfavoriteTattooWork(tattoo_work_id, token).subscribe(() =>{
          this.observableUser = this.userService.fetchAuthenticatedUser(token);
          console.log("unFavorite")
        })
      })
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
    review.postedBy=this.authService.authenticatedUser.id
    this.reviewService.createReview(this.target_uid,review).subscribe(data => {
      console.log(data)
      this.userReviews.push(data)
    })
  }

  deleteReview(id: string) {
    this.authService.getCurrentUser().getIdToken(true).then(async token => {
      this.reviewService.deleteReviewById(id,token).subscribe(()=>{
        console.log("deletedReview")
          this.userReviews=this.userReviews.filter(rev=>rev.id!==id)
      })
    })
  }

  openDialog(reviewId:string) {
    this.dialog.open(EditReviewComponent,{data:reviewId})
  }
}
