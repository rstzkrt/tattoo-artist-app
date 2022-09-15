import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {Observable} from "rxjs";
import {TattooWorksResponseDto} from "../../generated-apis/user";
import {AuthService} from "../../services/auth.service";
import {User} from "../../common/user";
import {UserService} from "../../services/user.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {StreamChat} from "stream-chat";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-tattoo-work-detail-page',
  templateUrl: './tattoo-work-detail-page.component.html',
  styleUrls: ['./tattoo-work-detail-page.component.css']
})
export class TattooWorkDetailPageComponent implements OnInit {

  id:string
  tattooWork:Observable<TattooWorksResponseDto>

  constructor(private activatedRoute:ActivatedRoute,
              private tattooWorkService:TattooWorkService,
              public authService:AuthService,
              private userService:UserService,
              private afAuth:AngularFireAuth,
              private router: Router) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
  }

   ngOnInit() {
    this.tattooWork = this.tattooWorkService.getTattooWorkById(this.id)
  }

  async handleSendMessage(target_uuid:string) {
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
