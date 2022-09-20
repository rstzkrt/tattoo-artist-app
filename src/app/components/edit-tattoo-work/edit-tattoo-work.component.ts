import {Component, OnInit} from '@angular/core';
import {TattooWorkService} from "../../services/tattoo-work.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TattooWorkPatchRequestDto} from "../../generated-apis/tatoo-work";
import {Currency} from "../../generated-apis/user";
import {Observable} from "rxjs";
import {finalize, map, startWith} from "rxjs/operators";
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-edit-tattoo-work',
  templateUrl: './edit-tattoo-work.component.html',
  styleUrls: ['./edit-tattoo-work.component.css']
})
export class EditTattooWorkComponent implements OnInit {

  tattooWorkId: string
  patchTattooWorkFormGroup: FormGroup
  currencies:string[]=[]
  filteredOptions: Observable<string[]>;
  tattooWorkPhotos:string[]
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;

  constructor(private tattooService: TattooWorkService,
              private router: ActivatedRoute,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private tattooWorkService: TattooWorkService,
              private route:Router,
              private afStorage:AngularFireStorage,
              private storageService:StorageService) {
    this.tattooWorkId = this.router.snapshot.paramMap.get('id')
    for (let currency in Currency) {
      this.currencies.push(<"AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" | "AZN" | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BOV" | "BRL" | "BSD" | "BTC" | "BTN" | "BWP" | "BYR" | "BYN" | "BZD" | "CAD" | "CDF" | "CHE" | "CHF" | "CHW" | "CLF" | "CLP" | "CNY" | "COP" | "COU" | "CRC" | "CUC" | "CUP" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EGP" | "ERN" | "ETB" | "EUR" | "FJD" | "FKP" | "GBP" | "GEL" | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "IQD" | "IRR" | "ISK" | "JMD" | "JOD" | "JPY" | "KES" | "KGS" | "KHR" | "KMF" | "KPW" | "KRW" | "KWD" | "KYD" | "KZT" | "LAK" | "LBP" | "LKR" | "LRD" | "LSL" | "LTL" | "LVL" | "LYD" | "MAD" | "MDL" | "MGA" | "MKD" | "MMK" | "MNT" | "MOP" | "MRO" | "MRU" | "MUR" | "MVR" | "MWK" | "MXN" | "MXV" | "MYR" | "MZN" | "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD" | "OMR" | "PAB" | "PEN" | "PGK" | "PHP" | "PKR" | "PLN" | "PYG" | "QAR" | "RON" | "RSD" | "RUB" | "RWF" | "SAR" | "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SHP" | "SLL" | "SOS" | "SRD" | "STD" | "STN" | "SVC" | "SYP" | "SZL" | "THB" | "TJS" | "TMT" | "TND" | "TOP" | "TRY" | "TTD" | "TWD" | "TZS" | "UAH" | "UGX" | "USD" | "USN" | "UYI" | "UYU" | "UYW" | "UZS" | "VED" | "VEF" | "VES" | "VND" | "VUV" | "WST" | "XAG" | "XAU" | "XAF" | "XBA" | "XBB" | "XBC" | "XBD" | "XCD" | "XDR" | "XOF" | "XPD" | "XPF" | "XPT" | "XSU" | "XTS" | "XUA" | "XXX" | "YER" | "ZAR" | "ZMK" | "ZWL" | "ZMW" | "SSP">currency.toUpperCase())
    }
  }
   ngOnInit() :void {
    this.tattooService.getTattooWorkById(this.tattooWorkId).subscribe( tattooWork => {
       this.tattooWorkPhotos=tattooWork.photos
      this.patchTattooWorkFormGroup = new FormGroup({
         patchTattooWork: new FormGroup({
          price: new FormControl(tattooWork.price),
          currency: new FormControl(tattooWork.currency),
          coverPhoto: new FormControl(tattooWork.coverPhoto),
          description: new FormControl(tattooWork.description)
        })
      })
      this.filteredOptions = this.patchTattooWorkFormGroup.get('patchTattooWork').get('currency').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      )
    })
  }
  private _filter(value: string): string[] {
    console.log(value)
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.currencies.filter(option => option.toLowerCase().includes(filterValue));
  }
  update() {
    let tattooWorkPatch: TattooWorkPatchRequestDto = this.patchTattooWorkFormGroup.get('patchTattooWork').value;
    tattooWorkPatch.photos=this.tattooWorkPhotos
    tattooWorkPatch.coverPhoto= tattooWorkPatch.photos[0]
    if(tattooWorkPatch.photos.length<3){
      alert("Please choose at least 3 photos")
    }else {
      this.tattooService.patchTattooWork(this.tattooWorkId, tattooWorkPatch, this.storageService.getToken()).subscribe(data => {
        console.log(data)
      })
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
        this.tattooWorkPhotos.push(url)
      })
    });
    console.log(this.tattooWorkPhotos.length)
  }

  removeFromPhotos(url:string){
    if(this.tattooWorkPhotos.length<3){
      alert("at least 3 photos required")
    }else {
      this.afStorage.refFromURL(url).delete().subscribe(()=>{
        this.tattooWorkPhotos=this.tattooWorkPhotos.filter(url1=>url1!==url)
        //TODO update photos in database
      })
    }
  }

}
