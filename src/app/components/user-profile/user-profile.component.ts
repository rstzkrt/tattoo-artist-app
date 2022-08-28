import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChannelService, ChatClientService} from "stream-chat-angular";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(public userService:UserService,
              public authService:AuthService,
              private routeCurr:ActivatedRoute,
              private router:Router,
              private chatService: ChatClientService,
              private channelService: ChannelService,) {}

  ngOnInit(): void {
  }

  async handleSendMessage() {


    this.authService.getStreamToken().subscribe(async data => {
      await this.chatService.init(environment.stream.key,
        this.authService.getCurrentUser().uid, data)

      const target_uid:string =this.routeCurr.snapshot.paramMap.get('id')
      const filter = { type: 'messaging', members: { $in: [this.authService.getCurrentUser().uid, target_uid] } };
      const sort = [{ last_message_at: -1 }];

      console.log()
      console.log()
      const channels = await this.chatService.chatClient.queryChannels(filter, [], {
        watch: false,
        state: true,
      });
      console.log(channels)

      if(!channels){
        const channel = this.chatService.chatClient.channel(
          'messaging',
          {
            members: [this.authService.getCurrentUser().uid,target_uid]
          });
        await channel.create();
      }
      console.log(channels[0].id)

      await this.router.navigateByUrl("/chat/" + channels[0].id)


    });


  }
}
