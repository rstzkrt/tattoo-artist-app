import {Injectable} from '@angular/core';
import {User} from "../common/user";
import firebase from "firebase/compat/app";
import {Observable, Observer} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserService} from "./user.service";
import {HttpClient} from "@angular/common/http";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {TokenOrProvider} from "stream-chat";

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
              private firebaseFunctions:AngularFireFunctions) {

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
    return this.firebaseUser;
  }

  getStreamToken() : Observable<TokenOrProvider> {
    // const data = this.firebaseFunctions.httpsCallable('ext-auth-chat-getStreamUserToken')
    //   .call(data => {
    //     console.log("data getstream "+data)
    //   });

    // const callable = this.firebaseFunctions.httpsCallable('ext-auth-chat-getStreamUserToken');
    // const data:any = callable({ name: 'some-data' });
    // let token;
    return  this.firebaseFunctions
      .httpsCallable("ext-auth-chat-getStreamUserToken")({});
      // .toPromise()
      // .then((r) => {
      //   token=r;
      // }).catch(err=>console.log(err));
    // return new Observable((observer: Observer<TokenOrProvider>) => {
    //   console.log(token+"asasdasd")
    //   observer.next(token);
    // });
  }

  async loginWithGoogle() {
    await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
      res => {
        this.requestBodyUser.uid = res.user.uid
        this.requestBodyUser.email = res.user.email;
        this.requestBodyUser.avatarUrl = res.user.photoURL;
        this.requestBodyUser.firstName = res.user.displayName.split(" ")[0];
        this.requestBodyUser.lastName = res.user.displayName.split(" ")[length];
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
    });
  }
}
