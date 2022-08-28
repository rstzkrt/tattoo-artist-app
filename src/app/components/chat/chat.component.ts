import {
  Component,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  Output,
  Input
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
import {from, Observable, of} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {catchError, debounceTime, map, startWith, switchMap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, AfterViewInit {

  chatIsReady$!: Observable<boolean>;

  @ViewChild('channelActionsTemplate')
  private channelActionsTemplate!: TemplateRef<ChannelActionsContext>;
  @ViewChild('channelPreview')
  private channelPreview!: TemplateRef<ChannelPreviewContext>;

  @Input()
  channel!: Channel;

  showDialog = false;

  userSearchField = new FormControl();

  availableUsers$!: Observable<UserResponse<DefaultStreamChatGenerics>[]>;

  @Output()
  saved = new EventEmitter<string>();
  channelName = new FormControl();

  channelList:Channel[];

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private auth: AuthService,
    private customTemplatesService: CustomTemplatesService,
    private chatClientService: ChatClientService,
    private routeCurr: ActivatedRoute
  ) {}


  async ngOnInit() {
    this.streamI18nService.setTranslation();
    this.chatIsReady$ = this.auth.getStreamToken().pipe(
      switchMap((streamToken) => {
          console.log("streamToken" + streamToken)
          const property = this.chatService.init(
            environment.stream.key,
            this.auth.getCurrentUser().uid,
            streamToken)
          console.log("data111" + property)
          return property;
        }
      ),
      switchMap(() => this.channelService.init({
        type: 'messaging',
        members: {$in: [this.auth.getCurrentUser().uid]},
      })),
      map(() => true),
      catchError(() => of(false))
    )

    this.availableUsers$ = this.userSearchField.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(queryString => this.chatClientService.autocompleteUsers(queryString)))

    const filter = {type: 'messaging', id: {$in: [this.routeCurr.snapshot.paramMap.get('id')]}};

    this.chatService.chatClient.queryChannels(filter, [], {
      watch: false,
      state: true,
    }).then(data => {
      this.activateChannel(data[0])
    }).catch(err => err);

    const filter1 = {type: 'messaging', members: {$in: [ this.auth.getCurrentUser().uid ]}};
    const sort = {last_message_at: -1};

    this.channelList = await this.chatClientService.chatClient.queryChannels(filter1, [], {state: true, watch: true});

    console.log(this.channelList[0]);
  }

  ngAfterViewInit(): void {
    this.customTemplatesService.channelPreviewTemplate$.next(
      this.channelPreview
    )
    this.customTemplatesService.channelActionsTemplate$.next(
      this.channelActionsTemplate
    )
  }

  // onCreate(name: string) {
  //   const dasherizedName = name.replace(/\s+/g, '-').toLowerCase();
  //   const channel = this.chatService.chatClient.channel(
  //     'messaging',
  //     dasherizedName,
  //     {
  //       name,
  //       members: [this.auth.getCurrentUser().uid]
  //     });
  //   from(channel.create());
  // }

  activateChannel(channel: Channel<DefaultStreamChatGenerics>) {
    this.channelService.setAsActiveChannel(channel);
  }

  addToChat({option: {value: userId}}: MatAutocompleteSelectedEvent) {
    this.channel.addMembers([userId])
  }
}
