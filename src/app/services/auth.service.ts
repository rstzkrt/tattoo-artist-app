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
import {EmailLoginReq, Login, LoginDialogComponent} from "../components/login-dialog/login-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {getAuth} from "firebase/auth";
import {StorageService} from "./storage.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userObservable: Observable<User>
  authenticatedUser: User
  firebaseUser: firebase.User;
  requestBodyUser: User = new User();
  idToken: Observable<string | null>;
  dialogRef: any;

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService,
              private httpClient: HttpClient,
              private firebaseFunctions: AngularFireFunctions,
              public dialog: MatDialog,
              private storageService: StorageService,
              private router: Router
  ) {

    this.afAuth.authState.subscribe(user => {
      console.log(user)
      this.firebaseUser = user;
      if (user) {
        user.getIdToken().then((token) => {
          this.storageService.saveToken(token)
          this.userObservable = userService.fetchAuthenticatedUser(token)
          userService.fetchAuthenticatedUser(token).subscribe(data => {
            this.storageService.saveUser(data)
            this.authenticatedUser = data;
          }, error => console.error(error))
        })
      }

    })
    this.afAuth.onIdTokenChanged(function (user) {
      if (user) {
        user.getIdToken().then(data => {
          storageService.saveToken(data)
          console.log("token update")
        })
      }
    });
  }

  async singInWithEmail(user: Login) {
    await this.afAuth.signInWithEmailAndPassword(user.email, user.password).then(
      res => {
        res.user.getIdToken().then(token => {
          this.userService.fetchAuthenticatedUser(token).subscribe(user => {
            let tokenFunction = this.firebaseFunctions.httpsCallable('ext-auth-chat-getStreamUserToken')
            tokenFunction({}).subscribe(async data => {
              const chatClient = StreamChat.getInstance(environment.stream.key);
              await chatClient.connectUser({
                  id: user.uid,
                  name: user.firstName + " " + user.lastName,
                  image: user.avatarUrl
                },
                data);
              window.location.replace('/')
            });
          })
        })
        console.log("Login Success")
        this.dialogRef.close()
      }
    ).catch(err => {
      window.alert(err)
      console.log(err)
    })
  }


  async singUpWithEmail(user: EmailLoginReq) {

      await this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then(
        async res => {
          this.requestBodyUser.uid = res.user.uid
          this.requestBodyUser.email = user.email;
          this.requestBodyUser.firstName = user.firstName
          this.requestBodyUser.lastName = user.lastName
          this.requestBodyUser.avatarUrl = "https://www.gravatar.com/avatar/?d=mp"

          this.userService.createClient(this.requestBodyUser).subscribe(user => {
            let tokenFunction = this.firebaseFunctions.httpsCallable('ext-auth-chat-getStreamUserToken')
            tokenFunction({}).subscribe(async data => {
              const chatClient = StreamChat.getInstance(environment.stream.key);
              await chatClient.connectUser({
                  id: user.uid,
                  name: user.firstName + " " + user.lastName,
                  image: user.avatarUrl
                },
                data);
              window.location.replace('/')
            });
            console.log(user);
          }, error => {
            console.log(error);
          });
          console.log("Login Success")
          this.dialogRef.close()
        }
      ).catch(err => {
        window.alert(err)
        console.log(err)
      })
  }

  async loginWithFacebook() {
    console.log('login')
    await this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(
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

        console.log(0)
        if (res.additionalUserInfo.isNewUser) {
          console.log(1)
          this.userService.createClient(this.requestBodyUser)
            .subscribe(response => {
              console.log(response);
            }, error => {
              console.log(error);
            });
        }
        console.log(2)

        let tokenFunction = this.firebaseFunctions.httpsCallable('ext-auth-chat-getStreamUserToken')
        tokenFunction({}).subscribe(async data => {
          const chatClient = StreamChat.getInstance(environment.stream.key);

          await chatClient.connectUser({
              id: this.requestBodyUser.uid,
              name: this.requestBodyUser.firstName + " " + this.requestBodyUser.lastName,
              image: this.requestBodyUser.avatarUrl
            },
            data);
          console.log(4)
          window.location.replace('/')
          console.log(5)

        });
        console.log("Login Success")
        this.dialogRef.close()
        console.log(6)
      }
    ).catch(err => {
      console.log(7)
      console.log(err)
    })
    console.log(8)
  }

  async loginWithGoogle() {
    await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      res => {
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
          this.userService.createClient(this.requestBodyUser).subscribe(response => {
              console.log(response);
            }, error => {
              console.log(error);
            });
        }

        let tokenFunction = this.firebaseFunctions.httpsCallable('ext-auth-chat-getStreamUserToken')
        tokenFunction({}).subscribe(async data => {
          const chatClient = StreamChat.getInstance(environment.stream.key);
          console.log(this.authenticatedUser)
          await chatClient.connectUser({
              id: this.requestBodyUser.uid,
              name: this.requestBodyUser.firstName + " " + this.requestBodyUser.lastName,
              image: this.requestBodyUser.avatarUrl
            },
            data);
          window.location.replace('/')
        });
        console.log("Login Success")
        this.dialogRef.close()
      }
    ).catch(err => {
      console.log(err)
    })
  }

  signUpDialog() {
    this.dialogRef = this.dialog.open(LoginDialogComponent);
  }

  logout() {
    this.afAuth.signOut().then(() => {
      console.log("Logged out!")
      this.storageService.clean()
      this.firebaseFunctions.httpsCallable('ext-auth-chat-revokeStreamUserToken')
        .call(data => {
          console.log(data)
        });
      window.location.replace('/home')
    });
    const chatClient = StreamChat.getInstance(environment.stream.key);
    chatClient.disconnectUser().then(r => {
    });
  }

  deleteAccount() {
    this.afAuth.currentUser.then(user => user?.delete())
  }

  getCurrentUser() {
    return this.firebaseUser;
  }

  getStreamToken(): Observable<TokenOrProvider> {
    return this.firebaseFunctions
      .httpsCallable("ext-auth-chat-getStreamUserToken")({});
  }
}
