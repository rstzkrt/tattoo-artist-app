import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {Observable} from "rxjs";
import {TattooWorksResponseDto} from "../../generated-apis/user";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {StreamChat} from "stream-chat";
import {environment} from "../../../environments/environment";
import {CommentPatchRequestDto, CommentRequestDto, CommentResponseDto} from "../../generated-apis/comment";
import {FormControl, FormGroup} from "@angular/forms";
import {CommentService} from "../../services/comment.service";

import SwiperCore, {FreeMode, Navigation, Thumbs} from "swiper";
import {User} from "../../common/user";
import {StorageService} from "../../services/storage.service";

SwiperCore.use([FreeMode, Navigation, Thumbs]);


@Component({
  selector: 'app-tattoo-work-detail-page',
  templateUrl: './tattoo-work-detail-page.component.html',
  styleUrls: ['./tattoo-work-detail-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TattooWorkDetailPageComponent implements OnInit {

  thumbsSwiper: any;
  isClicked: boolean = false
  id: string
  tattooWork: Observable<TattooWorksResponseDto>
  comment: CommentResponseDto;
  rates: Number[] = [1, 2, 3, 4, 5];
  commentFormGroup: FormGroup;
  commentUpdateFormGroup: FormGroup;
  images: Array<string> = []
  authenticatedUser: User;
  token: string;

  constructor(private activatedRoute: ActivatedRoute,
              private tattooWorkService: TattooWorkService,
              public authService: AuthService,
              private userService: UserService,
              private afAuth: AngularFireAuth,
              private router: Router,
              private commentService: CommentService,
              private storageService: StorageService,
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
  }

  ngOnInit(): void {
    this.token = this.storageService.getToken()
    this.authenticatedUser = this.storageService.getUser()
    this.tattooWork = this.tattooWorkService.getTattooWorkById(this.id)
    this.tattooWork.subscribe(data => this.images = data.photos)
    this.commentFormGroup = new FormGroup({
      commentGroup: new FormGroup({
        message: new FormControl(''),
        rate: new FormControl('')
      })
    })
    this.commentService.getCommentByTattooWorkId(this.id).subscribe(data => {
      this.comment = data
    })
  }

  async handleSendMessage(target_uuid: string) {
    this.authService.getStreamToken().subscribe(async data => {
      const chatClient = StreamChat.getInstance(environment.stream.key);
      await chatClient.connectUser(
        {
          id: this.authService.authenticatedUser.uid,
          name: this.authService.authenticatedUser.firstName + " " + this.authService.authenticatedUser.lastName,
          image: this.authService.authenticatedUser.avatarUrl,
        },
        data,);
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

  deleteComment(id: string) {
    this.commentService.deleteCommentById(id, this.token).subscribe(() => {
      this.comment = null
      console.log("deleted")
    })
  }

  openCommentEditSection(id: string) {
    this.commentService.getCommentById(id).subscribe(comment => {
      this.commentUpdateFormGroup = new FormGroup({
        commentUpdateGroup: new FormGroup({
          message: new FormControl(comment.message),
          rate: new FormControl(comment.rate)
        })
      })
    })
    this.isClicked = !this.isClicked
  }

  editComment(id: string) {
    let commentToUpdate: CommentPatchRequestDto = this.commentUpdateFormGroup.get('commentUpdateGroup').value;
    this.commentService.editComment(id, commentToUpdate, this.token).subscribe(comment => {
      this.comment = comment
    })
    this.isClicked = !this.isClicked
  }

  submit() {
    let comment: CommentRequestDto = this.commentFormGroup.get('commentGroup').value;
    comment.postedBy = this.authenticatedUser.id
    this.commentService.createComment(this.id, comment).subscribe(data => {
      this.comment = data
      console.log(data)
    })
  }

  deleteTattooWork(id: string) {
    this.tattooWorkService.deleteTattooWork(id, this.token).subscribe(data => {
      this.fetchUser()
      console.log(data)
    })
  }

  private fetchUser() :void {
    this.userService.fetchAuthenticatedUser(this.token).subscribe(user => {
      this.storageService.saveUser(user)
      this.authenticatedUser = user
    })
  }

}
