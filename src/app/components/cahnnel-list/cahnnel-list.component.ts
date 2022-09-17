import { Component, OnInit } from '@angular/core';
import {ChannelService, ChatClientService} from "stream-chat-angular";
import {Channel} from "stream-chat";
import {DefaultStreamChatGenerics} from "stream-chat-angular/lib/types";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-cahnnel-list',
  templateUrl: './cahnnel-list.component.html',
  styleUrls: ['./cahnnel-list.component.css']
})
export class CahnnelListComponent implements OnInit {

  channels: Channel<DefaultStreamChatGenerics>[]

  activatedChannel:Channel<DefaultStreamChatGenerics>
  //TODO activated channel color change

  constructor(private channelService: ChannelService,private afAuth: AngularFireAuth,public authService:AuthService,private chatService: ChatClientService) {
    this.afAuth.authState.subscribe(async (user) => {
      const filter = {type: 'messaging', members: {$in: [user.uid]}};
      this.channels= await this.chatService.chatClient.queryChannels(filter, {last_message_at: -1}, {
        watch: true,
        state: true,
      })
    })
  }

  ngOnInit(): void {
  }
  activateChannel(channel: Channel<DefaultStreamChatGenerics>) {
      this.channelService.setAsActiveChannel(channel);
      this.activatedChannel=channel;
  }
}
