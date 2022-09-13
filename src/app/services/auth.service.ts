import {Injectable} from '@angular/core';
import {User} from "../common/user";
import firebase from "firebase/compat/app";
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserService} from "./user.service";
import {HttpClient} from "@angular/common/http";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {StreamChat, TokenOrProvider} from "stream-chat";
import {environment} from "../../environments/environment";
import {LoginDialogComponent} from "../components/login-dialog/login-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import { getAuth, deleteUser } from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticatedUser: User = new User();
  firebaseUser: firebase.User;
  requestBodyUser: User = new User();
  idToken: Observable<string | null>;
  dialogRef:any;

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService,
              private httpClient: HttpClient,
              private firebaseFunctions: AngularFireFunctions,
              public dialog: MatDialog) {

    this.afAuth.authState.subscribe(user => {
      console.log(user)
      this.firebaseUser = user;
      if (user) {
        user.getIdToken().then((token) => {
          userService.fetchAuthenticatedUser(token).subscribe(data => {
            this.authenticatedUser = data;
            console.log(this.authenticatedUser)
          }, error => console.error(error))
        })
      }
    });
  }

  deleteAccount(){
    const auth = getAuth();
    const user = auth.currentUser;
    deleteUser(user).then(() => {
      console.log("deleted")
    }).catch((error) => {
      console.log(error)
    });
  }

  getCurrentUser() {
    return this.firebaseUser;
  }

  getStreamToken(): Observable<TokenOrProvider> {
    return this.firebaseFunctions
      .httpsCallable("ext-auth-chat-getStreamUserToken")({});
  }

  async loginWithGoogle() {
    await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      async res => {
        this.requestBodyUser.uid = res.user.uid
        this.requestBodyUser.email = res.user.email;
        this.requestBodyUser.avatarUrl = res.user.photoURL;
        if (res.user.displayName.split(" ").length === 1) {
          this.requestBodyUser.firstName = res.user.displayName;
          this.requestBodyUser.lastName = "";
        } else {
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
        }


        let tokenFunction = this.firebaseFunctions.httpsCallable('ext-auth-chat-getStreamUserToken')
        tokenFunction({}).subscribe(async data => {
          const chatClient = StreamChat.getInstance(environment.stream.key);
          console.log(this.authenticatedUser)
          await chatClient.connectUser(
            {
              id: this.authenticatedUser.uid,
              name: this.authenticatedUser.firstName + " " + this.authenticatedUser.lastName,
              image: this.authenticatedUser.avatarUrl,
            },
            data,
          );
          console.log(data)
        });
        console.log("Login Success")
        this.dialogRef.close()
      }
    ).catch(err => {
      console.log(err)
    })
  }

  signUpDialog() {
    this.dialogRef= this.dialog.open(LoginDialogComponent);
  }

  logout() {
    this.afAuth.signOut().then(() => {
      console.log("Logged out!")
      this.firebaseFunctions.httpsCallable('ext-auth-chat-revokeStreamUserToken')
        .call(data => {
          console.log(data)
        });

    });
    const chatClient = StreamChat.getInstance(environment.stream.key);
    chatClient.disconnectUser().then(r => {});
  }
}
