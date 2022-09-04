import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChannelService, ChatClientService} from "stream-chat-angular";
import {environment} from "../../../environments/environment";
import {User} from "../../common/user";
import {StreamChat} from "stream-chat";
import {user} from "@angular/fire/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user:User=new User();

  constructor(public userService: UserService,
              public authService: AuthService,
              private routeCurr: ActivatedRoute,
              private router: Router,
              private chatService: ChatClientService,
              private channelService: ChannelService,
              private firebaseFunctions:AngularFireFunctions) {
    const target_uid: string = this.routeCurr.snapshot.paramMap.get('id')
    userService.getUserById(target_uid).subscribe(async user => {
      this.user=user;
    });
  }

  ngOnInit(): void {
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

        const check= channels.filter(c=>{
          let members=c.state.members
          // console.log("member:" +members[receiverUser.uid])
          return members[receiverUser.uid]!==undefined
        } )

        // console.log(check)
        if (check.length===0) {
          // console.log("if")
          const channel = client.channel('messaging', { members: [this.authService.getCurrentUser().uid, receiverUser.uid]});
          await channel.create();
          await this.router.navigateByUrl("/chats/" + channel.id)
        } else {
          // console.log("else1")
          await this.router.navigateByUrl("/chats/" + check[0].id)
        }
      });

      // console.log(data)
    });



    // this.authService.getStreamToken().subscribe(async data => {
    //   await this.chatService.init(environment.stream.key,
    //     this.authService.getCurrentUser().uid, data)
    //   const target_uid: string = this.routeCurr.snapshot.paramMap.get('id')
    //   this.userService.getUserById(target_uid).subscribe(async user => {
    //     const filter = {type: 'messaging', members: {$in: [this.authService.getCurrentUser().uid, user.uid]}};
    //     console.log(filter)
    //     const channels = await this.chatService.chatClient.queryChannels(filter, {last_message_at: -1}, {
    //       watch: false,
    //       state: true,
    //     });
    //     console.log(channels)
    //     if (!channels) {
    //       const channel = this.chatService.chatClient.channel(
    //         'messaging',
    //         {
    //           members: [this.authService.getCurrentUser().uid, target_uid]
    //         });
    //       await channel.create();
    //       await this.router.navigateByUrl("/chat/" + channel.id)
    //     } else {
    //       console.log("else1")
    //       await this.router.navigateByUrl("/chat/" + channels[0].id)
    //     }
    //   });
    // });
  }
}
