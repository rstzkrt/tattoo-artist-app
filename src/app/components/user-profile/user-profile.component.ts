import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChannelService, ChatClientService} from "stream-chat-angular";
import {environment} from "../../../environments/environment";
import {User} from "../../common/user";
import {StreamChat} from "stream-chat";
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
              private router: Router) {
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
          return members[receiverUser.uid]!==undefined
        } )
        if (check.length===0) {
          const channel = client.channel('messaging', { members: [this.authService.getCurrentUser().uid, receiverUser.uid]});
          await channel.create();
          await this.router.navigateByUrl("/chats/" + channel.id)
        } else {
          await this.router.navigateByUrl("/chats/" + check[0].id)
        }
      });
    });
  }
}
