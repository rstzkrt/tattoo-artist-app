import {
  AfterViewInit, APP_INITIALIZER,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {Channel, UserResponse} from 'stream-chat';
import {
  ChannelActionsContext,
  ChannelPreviewContext,
  ChannelService,
  ChatClientService,
  CustomTemplatesService,
  DefaultStreamChatGenerics,
  StreamI18nService
} from 'stream-chat-angular';
import {Observable, of} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {environment} from "../../../environments/environment";
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {catchError, map, switchMap} from "rxjs/operators";
import {User} from "../../common/user";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  // changeDetection: ChangeDetectionStrategy.Default
})
export class ChatComponent implements OnInit {

  @Input()
  chatIsReady:boolean=true;
  user=new User();
  // channelList: Channel[];

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private customTemplatesService: CustomTemplatesService,
    private routeCurr: ActivatedRoute
  ) {}

   ngOnInit() {

     this.afAuth.authState.subscribe(user => {
      let channel_id = this.routeCurr.snapshot.paramMap.get('id');
      const filter = {type: 'messaging', id: {$eq: channel_id}, members: {$in: [user.uid]}};

      this.streamI18nService.setTranslation();
      this.auth.getStreamToken().subscribe(async (token) => {
        this.chatService.init(environment.stream.key, user.uid, token)
          .then(() => {
            this.channelService.init({type: 'messaging', members: {$in: [user.uid]}})
              .then(() => {
                this.chatService.chatClient.queryChannels(filter, {last_message_at: -1}, {
                  watch: false,
                  state: true,
                }).then((channel) => {
                  this.activateChannel(channel[0])
                  this.chatIsReady = true
                })
              })
          })
      })
    })



    // this.chatIsReady = this.auth.getStreamToken().pipe(
    //
    //   switchMap((streamToken) => {
    //       console.log("streamToken" + streamToken)
    //       return  this.chatService.init(
    //         environment.stream.key,
    //         this.auth.getCurrentUser().uid,
    //         streamToken)
    //     }
    //   ),
    //   switchMap(() => this.channelService.init({
    //     type: 'messaging',
    //     members: {$in: [this.auth.getCurrentUser().uid]},
    //   })),
    //   switchMap(() =>  this.chatService.chatClient.queryChannels(filter, {last_message_at: -1}, {
    //       watch: false,
    //       state: true,
    //     })
    //   ),
    //   map(() => true),
    //   catchError(() => of(false))
    // )
    //
    // this.chatService.chatClient.queryChannels(filter, {last_message_at: -1}, {
    //   watch: false,
    //   state: true,
    // }).then(data => {
    //   console.log(data)
    //   this.activateChannel(data[0])
    // }).catch(err => err);
  }

  activateChannel(channel: Channel<DefaultStreamChatGenerics>) {
    this.channelService.setAsActiveChannel(channel);
  }
}
