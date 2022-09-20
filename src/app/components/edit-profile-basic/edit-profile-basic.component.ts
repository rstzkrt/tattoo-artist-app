import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {MatDialog} from "@angular/material/dialog";
import {StorageService} from "../../services/storage.service";
import {User} from "../../common/user";
import {UserUpdateRequestDto} from "../../generated-apis/user";
import {Observable} from "rxjs";
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-edit-profile-basic',
  templateUrl: './edit-profile-basic.component.html',
  styleUrls: ['./edit-profile-basic.component.css']
})
export class EditProfileBasicComponent implements OnInit {

  updateProfileFormGroup: FormGroup;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  authenticatedUser: User
  token: string
  avatarUrl:string
  uploadProgress: Observable<number>;

  constructor(private userService: UserService,
              private aRouter: ActivatedRoute,
              private authService: AuthService,
              private afAuth: AngularFireAuth,
              private dialog: MatDialog,
              private router: Router,
              private storageService: StorageService,
              private afStorage:AngularFireStorage) { }

  ngOnInit(): void {
    this.token = this.storageService.getToken()
    this.userService.fetchAuthenticatedUser(this.token).subscribe(user => {
      this.avatarUrl=user.avatarUrl
      this.updateProfileFormGroup = new FormGroup({
        updateProfile: new FormGroup({
          firstName: new FormControl(user.firstName),
          lastName: new FormControl(user.lastName),
        })
      })
    })
  }

  submit() {
    let userUpdate: UserUpdateRequestDto = this.updateProfileFormGroup.get('updateProfile').value;
    userUpdate.avatarUrl= this.avatarUrl
    if(!this.avatarUrl){
      alert("please upload image for your avatar")
    }else {
      this.userService.updateMe(userUpdate, this.token).subscribe(data => {
        this.storageService.saveUser(data)
        this.authenticatedUser=this.storageService.getUser()
        if (data) {
          window.location.replace("/me")
        }
      })
    }
  }

  upload(event: any) {
    if(this.avatarUrl){
      alert("Please first remove the existing avatar")
    }else {
      const randomId = Math.random().toString(36).substring(2);
      const fileName = event.target.files[0].name
      const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
      this.ref = this.afStorage.ref('/images/' + randomId +"."+ extension +"?alt=media");
      this.task = this.ref.put(event.target.files[0]);
      this.uploadProgress = this.task.percentageChanges();
      this.task.snapshotChanges().pipe(
        finalize( () => {
          // this.avatarUrl =  this.ref.getDownloadURL()
        })
      ).subscribe(data=>data.ref.getDownloadURL().then(url=>this.avatarUrl=url));
    }
  }

  removeFromPhotos(url:string){
    this.afStorage.refFromURL(url).delete().subscribe(()=>{
      this.avatarUrl=null
    })
  }
}
