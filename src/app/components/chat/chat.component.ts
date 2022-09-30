import {AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Channel} from 'stream-chat';
import {
  ChannelPreviewContext,
  ChannelService,
  ChatClientService,
  CustomTemplatesService,
  DefaultStreamChatGenerics,
  StreamI18nService
} from 'stream-chat-angular';
import {AuthService} from "../../services/auth.service";
import {environment} from "../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewInit {

  @Input()
  chatIsReady: boolean;
  @ViewChild('channelPreview')
  private channelPreview!: TemplateRef<ChannelPreviewContext>;
  channel_id: string;

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private customTemplatesService: CustomTemplatesService,
    private routeCurr: ActivatedRoute
  ) {
    this.channel_id = this.routeCurr.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    window.document.body.style.backgroundColor="#303030"
    this.afAuth.authState.subscribe(user => {
      const filter = {type: 'messaging', id: {$eq: this.channel_id}, members: {$in: [user.uid]}};
      this.streamI18nService.setTranslation();
      this.auth.getStreamToken().subscribe(async (token) => {
        this.chatService.init(environment.stream.key, user.uid, token)
          .then(() => {
            this.channelService.init({type: 'messaging', members: {$in: [user.uid]}})
              .then(() => {
                if (this.channel_id !== null) {
                  this.chatService.chatClient.queryChannels(filter, {last_message_at: -1}, {
                    watch: false,
                    state: true,
                  }).then((channel) => {
                    this.activateChannel(channel[0])
                  })
                }
                this.chatIsReady = true
              })
          })
      })
    })
  }

  ngAfterViewInit(): void {
      this.customTemplatesService.channelPreviewTemplate$.next(
        this.channelPreview
      )
  }

  activateChannel(channel: Channel<DefaultStreamChatGenerics>) {
    if (this.channel_id !== null) {
      this.channelService.setAsActiveChannel(channel);
    }
  }
}
