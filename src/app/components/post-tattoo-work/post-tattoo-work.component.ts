import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TattooWorkPostRequestDto} from "../../generated-apis/tatoo-work";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {Observable} from "rxjs";
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap} from "rxjs/operators";
import {StorageService} from "../../services/storage.service";
import {TattooStyle, UserDocumentDto} from "../../generated-apis/user";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-post-tattoo-work',
  templateUrl: './post-tattoo-work.component.html',
  styleUrls: ['./post-tattoo-work.component.css']
})
export class PostTattooWorkComponent implements OnInit {

  postTattooWorkFormGroup: FormGroup
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  imageUrlList:string[]=[];
  token:string
  tattooStyles: TattooStyle[]= [TattooStyle.Tribal, TattooStyle.Tribal,TattooStyle.AsianOriental,TattooStyle.Biomechanical,TattooStyle.DotWork,TattooStyle.Script,TattooStyle.BlackAndGrey,TattooStyle.NewSchool,"OLD_SCHOOL",TattooStyle.Portraits,"WATERCOLOUR",TattooStyle.Realistic];
  autocompleteList: Observable<UserDocumentDto[]>;
  clientId:string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private tattooWorkService: TattooWorkService,
              private route:Router,
              private afStorage:AngularFireStorage,
              private storageService:StorageService,
              private httpClient:HttpClient,
              private userService: UserService){
    this.postTattooWorkFormGroup = this.formBuilder.group({
      postTattooWork: this.formBuilder.group({
        price: new FormControl('',Validators.required),
        currency: new FormControl('',Validators.required),
        description: new FormControl('',Validators.required),
        clientId: new FormControl('',Validators.required),
        tattooStyle:new FormControl('',Validators.required)
      })
    })
    this.autocompleteList = this.postTattooWorkFormGroup.get('postTattooWork').get('clientId').valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      filter((name) => !!name),
      switchMap(name => this.searchUsers(name))
    );
  }

  ngOnInit(): void {
    this.token=this.storageService.getToken()
  }

  searchUsers(fullName: string): Observable<UserDocumentDto[]> {
    return this.userService.searchUsers(fullName);
  }

  removeFromPhotos(url:string){
    this.afStorage.refFromURL(url).delete().subscribe(()=>{
       this.imageUrlList=this.imageUrlList.filter(url1=>url1!==url)
    })
  }

  submit() {
    let tattooWork:TattooWorkPostRequestDto = this.postTattooWorkFormGroup.get('postTattooWork').value;
    tattooWork.photos=this.imageUrlList
    tattooWork.coverPhoto=this.imageUrlList[0]
    tattooWork.clientId= this.clientId;
    if(tattooWork.photos.length<1){
      alert("Please choose at least 3 photos")
    }else {
      this.tattooWorkService.createTattooWork(tattooWork, this.token).subscribe(res => {
        console.log(res)
        if(res){
          this.route.navigateByUrl("/me").then()
        }
      }, error => {
        console.error(error)
      });
    }
  }

  upload(event: any) {
    const randomId = Math.random().toString(36).substring(2);
    const fileName = event.target.files[0].name
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
    this.ref = this.afStorage.ref('/images/' + randomId +"."+ extension +"?alt=media");
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize( () => {
        this.downloadURL =  this.ref.getDownloadURL()
        // this.imageUrlList.push(this.downloadURL)
      })
    ).subscribe(data=>{
      data.ref.getDownloadURL().then(url=>{
        this.imageUrlList.push(url)
      })
    });
    console.log(this.imageUrlList.length)
  }
  selectClient(id: string) {
    this.clientId=id;
  }
}
