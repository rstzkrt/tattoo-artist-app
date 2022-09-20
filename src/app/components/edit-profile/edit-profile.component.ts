import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserUpdateRequestDto, WorkingDays} from "../../generated-apis/user";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../common/user";
import {StorageService} from "../../services/storage.service";
import {finalize} from "rxjs/operators";
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {Observable} from "rxjs";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  updateProfileFormGroup: FormGroup
  days: WorkingDays[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
  authenticatedUser: User
  token: string
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  avatarUrl:string
  uploadProgress: Observable<number>;

  constructor(private userService: UserService,
              private aRouter: ActivatedRoute,
              private authService: AuthService,
              private afAuth: AngularFireAuth,
              private dialog: MatDialog,
              private router: Router,
              private storageService: StorageService,
              private afStorage:AngularFireStorage) {
  }

  ngOnInit() {
    this.token = this.storageService.getToken()
    this.userService.fetchAuthenticatedUser(this.token).subscribe(user => {
      this.avatarUrl=user.avatarUrl
      this.updateProfileFormGroup = new FormGroup({
        updateProfile: new FormGroup({
          firstName: new FormControl(user.firstName),
          lastName: new FormControl(user.lastName),
          birthDate: new FormControl(new Date(user.birthDate)),
          // avatarUrl: new FormControl(user.avatarUrl),
          phoneNumber: new FormControl(user.phoneNumber),
          workDays: new FormControl(user.workDays),
          email: new FormControl(user.email),
          street: new FormControl(user.street),
          city: new FormControl(user.city),
          country: new FormControl(user.country),
          state: new FormControl(user.state),
          postalCode: new FormControl(user.postalCode),
          otherInformation: new FormControl(user.otherInformation)
        })
      })
    })
  }

  submit() {
    let userUpdate: UserUpdateRequestDto = this.updateProfileFormGroup.get('updateProfile').value;
    userUpdate.avatarUrl=this.avatarUrl
    if(!this.avatarUrl){
      alert("please upload image for your avatar")
    }else {
      this.userService.updateMe(userUpdate, this.token).subscribe(data => {
        this.storageService.saveUser(data)
        this.authenticatedUser=this.storageService.getUser()
        if (data) {
          this.router.navigateByUrl('/me').then(r => console.log("updated"))
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
