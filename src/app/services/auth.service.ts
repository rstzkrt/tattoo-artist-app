import {Injectable} from '@angular/core';
import {User} from "../common/user";
import firebase from "firebase/compat/app";
import {Observable, Observer} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserService} from "./user.service";
import {HttpClient} from "@angular/common/http";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {TokenOrProvider} from "stream-chat";
import {ChatComponent} from "../components/chat/chat.component";
import {ChatClientService} from "stream-chat-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticatedUser: User = new User();
  firebaseUser: firebase.User;
  requestBodyUser: User = new User();
  idToken: Observable<string | null>;

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService,
              private httpClient:HttpClient,
              private auth:AngularFireAuth,
              private firebaseFunctions:AngularFireFunctions,
              private chatComp:ChatClientService) {

    this.afAuth.authState.subscribe(user => {
      this.firebaseUser = user;
      if (user) {
        user.getIdToken().then((token) => {
          userService.fetchAuthenticatedUser(token).subscribe(data => {
            this.authenticatedUser = data;
          }, error => console.error(error))
        })
      }
    });
  }
  getCurrentUser() {
    console.log(this.firebaseUser.uid)
    return this.firebaseUser;
  }

  getStreamToken() : Observable<TokenOrProvider> {
    return  this.firebaseFunctions
      .httpsCallable("ext-auth-chat-getStreamUserToken")({});
  }

  async loginWithGoogle() {
    await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      res => {
        this.requestBodyUser.uid = res.user.uid
        this.requestBodyUser.email = res.user.email;
        this.requestBodyUser.avatarUrl = res.user.photoURL;
        if(res.user.displayName.split(" ").length===1){
          this.requestBodyUser.firstName = res.user.displayName;
          this.requestBodyUser.lastName = res.user.displayName;
        }else {
          this.requestBodyUser.firstName = res.user.displayName.split(" ")[0];
          this.requestBodyUser.lastName = res.user.displayName.split(" ")[length];
        }
        if (res.additionalUserInfo.isNewUser) {
          this.userService.registerClient(this.requestBodyUser)
            .subscribe(response => {
              console.log(response);
            }, error => {
              console.log(error);
            });
          this.firebaseFunctions.httpsCallable('ext-auth-chat-getStreamUserToken')
            .call(data => {
              console.log(data)
            });
        }
        console.log("Login Success")
      }
    ).catch(err => {
      console.log(err)
    })
  }

  logout() {
    this.afAuth.signOut().then(() => {
      console.log("Logged out!")
      this.firebaseFunctions.httpsCallable('ext-auth-chat-revokeStreamUserToken')
        .call(data => {
          console.log(data)
        });
      this.chatComp.disconnectUser();
    });
  }
}
