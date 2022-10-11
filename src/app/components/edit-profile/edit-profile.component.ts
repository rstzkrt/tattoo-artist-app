import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Gender, Language, TattooStyle, UserUpdateRequestDto, WorkingDays} from "../../generated-apis/user";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../common/user";
import {StorageService} from "../../services/storage.service";
import {finalize} from "rxjs/operators";
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from "@angular/fire/compat/storage";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

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
  avatarUrl: string
  uploadProgress: Observable<number>;
  genders: Gender[] = ["MALE", "FEMALE"];
  tattooStyles: TattooStyle[] = ["TRIBAL", TattooStyle.Tribal, TattooStyle.AsianOriental, TattooStyle.Biomechanical, TattooStyle.DotWork, TattooStyle.Script, "BLACK_AND_GREY", TattooStyle.NewSchool, "OLD_SCHOOL", TattooStyle.Portraits, "WATERCOLOUR", TattooStyle.Realistic];
  languages: string[] = []
  countries: Array<Object> = [];
  cities: string[] = [];
  states: Array<Object> = [];
  chosenCountry: string

  constructor(private userService: UserService,
              private aRouter: ActivatedRoute,
              private authService: AuthService,
              private afAuth: AngularFireAuth,
              private dialog: MatDialog,
              private router: Router,
              private storageService: StorageService,
              private afStorage: AngularFireStorage,
              private httpClient: HttpClient) {
    console.log("1 kere")
    this.token = this.storageService.getToken()
    for (let language in Language) {
      this.languages.push(<"AFAR" | "ABKHAZ" | "AVESTAN" | "AFRIKAANS" | "AKAN" | "AMHARIC" | "ARAGONESE" | "ARABIC" | "ASSAMESE" | "AVARIC" | "AYMARA" | "AZERBAIJANI" | "BASHKIR" | "BELARUSIAN" | "BULGARIAN" | "BIHARI" | "BISLAMA" | "BAMBARA" | "BENGALI" | "TIBETAN" | "BRETON" | "BOSNIAN" | "CATALAN" | "CHECHEN" | "CHAMORRO" | "CORSICAN" | "CREE" | "CZECH" | "OLD CHURCH SLAVONIC" | "CHUVASH" | "WELSH" | "DANISH" | "GERMAN" | "DIVEHI" | "DZONGKHA" | "EWE" | "GREEK" | "ENGLISH" | "ESPERANTO" | "SPANISH" | "ESTONIAN" | "BASQUE" | "PERSIAN" | "FULA" | "FINNISH" | "FIJIAN" | "FAROESE" | "FRENCH" | "WESTERN FRISIAN" | "IRISH" | "SCOTTISH GAELIC" | "GALICIAN" | "GUJARATI" | "MANX" | "HAUSA" | "HEBREW" | "HINDI" | "HIRI MOTU" | "CROATIAN" | "HAITIAN" | "HUNGARIAN" | "ARMENIAN" | "HERERO" | "INTERLINGUA" | "INDONESIAN" | "INTERLINGUE" | "IGBO" | "NUOSU" | "INUPIAQ" | "IDO" | "ICELANDIC" | "ITALIAN" | "INUKTITUT" | "JAPANESE" | "JAVANESE" | "GEORGIAN" | "KONGO" | "KIKUYU" | "KWANYAMA" | "KAZAKH" | "KALAALLISUT" | "KHMER" | "KANNADA" | "KOREAN" | "KANURI" | "KASHMIRI" | "KURDISH" | "KOMI" | "CORNISH" | "KYRGYZ" | "LATIN" | "LUXEMBOURGISH" | "GANDA" | "LIMBURGISH" | "LINGALA" | "LAO" | "LITHUANIAN" | "LUBA-KATANGA" | "LATVIAN" | "MALAGASY" | "MARSHALLESE" | "MĀORI" | "MACEDONIAN" | "MALAYALAM" | "MONGOLIAN" | "MARATHI" | "MALAY" | "MALTESE" | "BURMESE" | "NAURU" | "NORWEGIAN BOKMÅL" | "NORTHERN NDEBELE" | "NEPALI" | "NDONGA" | "DUTCH" | "NORWEGIAN NYNORSK" | "NORWEGIAN" | "SOUTHERN NDEBELE" | "NAVAJO" | "CHICHEWA" | "OCCITAN" | "OJIBWE" | "OROMO" | "ORIYA" | "OSSETIAN" | "PANJABI" | "PĀLI" | "POLISH" | "PASHTO" | "PORTUGUESE" | "QUECHUA" | "ROMANSH" | "KIRUNDI" | "ROMANIAN" | "RUSSIAN" | "KINYARWANDA" | "SANSKRIT" | "SARDINIAN" | "SINDHI" | "NORTHERN SAMI" | "SANGO" | "SINHALA" | "SLOVAK" | "SLOVENIAN" | "SHONA" | "SOMALI" | "ALBANIAN" | "SERBIAN" | "SWATI" | "SOUTHERN SOTHO" | "SUNDANESE" | "SWEDISH" | "SWAHILI" | "TAMIL" | "TELUGU" | "TAJIK" | "THAI" | "TIGRINYA" | "TURKMEN" | "TAGALOG" | "TSWANA" | "TONGA" | "TURKISH" | "TSONGA" | "TATAR" | "TWI" | "TAHITIAN" | "UYGHUR" | "UKRAINIAN" | "URDU" | "UZBEK" | "VENDA" | "VIETNAMESE" | "VOLAPÜK" | "WALLOON" | "WOLOF" | "XHOSA" | "YIDDISH" | "YORUBA" | "ZHUANG" | "CHINESE" | "ZULU">language.toUpperCase())
    }

  }

  ngOnInit() {

    const headers = {'content-type': 'application/json', 'X-CSCAPI-KEY': `${environment.citiesApiKey}`};
    this.httpClient.get("https://api.countrystatecity.in/v1/countries", {headers: headers}).subscribe((data: Array<Object>) => {
      this.countries = data
    })

    this.userService.fetchAuthenticatedUser(this.token).subscribe(user => {
      this.avatarUrl = user.avatarUrl
      this.updateProfileFormGroup = new FormGroup({
        updateProfile: new FormGroup({
          firstName: new FormControl(user.firstName),
          lastName: new FormControl(user.lastName),
          birthDate: new FormControl(new Date(user.birthDate)),
          // avatarUrl: new FormControl(user.avatarUrl),
          phoneNumber: new FormControl(user.phoneNumber),
          workDays: new FormControl(user.workDays),
          // email: new FormControl(user.email),
          street: new FormControl(user.street),
          city: new FormControl(user.city),
          country: new FormControl(user.country),
          state: new FormControl(user.state),
          postalCode: new FormControl(user.postalCode),
          otherInformation: new FormControl(user.otherInformation),
          gender: new FormControl(user.gender),
          careerDescription: new FormControl(user.careerDescription),
          tattooStyles: new FormControl(user.tattooStyles),
          languages: new FormControl(user.languages)
        })
      })
    })
  }

  submit() {
    let userUpdate: UserUpdateRequestDto = this.updateProfileFormGroup.get('updateProfile').value;
    userUpdate.avatarUrl = this.avatarUrl
    if (!this.avatarUrl) {
      alert("please upload image for your avatar")
    } else {
      this.userService.updateMe(userUpdate, this.token).subscribe(data => {
        this.storageService.saveUser(data)
        this.authenticatedUser = this.storageService.getUser()
        if (data) {
          this.router.navigateByUrl('/me').then(r => console.log("updated"))
        }
      })
    }

  }

  upload(event: any) {
    if (this.avatarUrl) {
      alert("Please first remove the existing avatar")
    } else {
      const randomId = Math.random().toString(36).substring(2);
      const fileName = event.target.files[0].name
      const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
      this.ref = this.afStorage.ref('/images/' + randomId + "." + extension + "?alt=media");
      this.task = this.ref.put(event.target.files[0]);
      this.uploadProgress = this.task.percentageChanges();
      this.task.snapshotChanges().pipe(
        finalize(() => {
          // this.avatarUrl =  this.ref.getDownloadURL()
        })
      ).subscribe(data => data.ref.getDownloadURL().then(url => this.avatarUrl = url));
    }
  }

  removeFromPhotos(url: string) {
    this.afStorage.refFromURL(url).delete().subscribe(() => {
      this.avatarUrl = null
    })
  }

   onCountrySelection(country: any) {
     if (country) {
       this.chosenCountry = country
       const headers = {'X-CSCAPI-KEY': `${environment.citiesApiKey}`};
       this.httpClient.get(`https://api.countrystatecity.in/v1/countries/${country}/states`, {headers: headers}).subscribe((data: Array<Object>) => {
         this.states =  data
         this.cities = null;
       })
     }else{
       this.states = null
       this.cities= null
     }

  }

   onStateSelection(state: string) {
     if (state) {
       const headers = { 'X-CSCAPI-KEY': `${environment.citiesApiKey}`};
       this.httpClient.get(`https://api.countrystatecity.in/v1/countries/${this.chosenCountry}/states/${state}/cities`, {headers: headers}).subscribe( (data: Array<Object>) => {
         this.cities = data.map(object => object['name'])
         console.log("cities")
         console.log(this.cities)
       })
     } else {
       this.cities = null;
     }

  }
}
