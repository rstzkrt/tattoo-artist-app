import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {Gender, Language, TattooArtistAccReqDto, TattooStyle, WorkingDays} from "../../generated-apis/user";
import {Router} from "@angular/router";
import {User} from "../../common/user";
import {StorageService} from "../../services/storage.service";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";



@Component({
  selector: 'app-create-artist-account-form',
  templateUrl: './create-artist-account-form.component.html',
  styleUrls: ['./create-artist-account-form.component.css']
})
export class CreateArtistAccountFormComponent implements OnInit {

  createArtistAccountFormGroup: FormGroup
  days: WorkingDays[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]
  authenticatedUser: User
  token: string
  genders: Gender[]=["MALE","FEMALE"];
  tattooStyles: TattooStyle[]= ["TRIBAL", TattooStyle.Tribal,TattooStyle.AsianOriental,TattooStyle.Biomechanical,TattooStyle.DotWork,TattooStyle.Script,"BLACK_AND_GREY",TattooStyle.NewSchool,"OLD_SCHOOL",TattooStyle.Portraits,"WATERCOLOUR",TattooStyle.Realistic];
  languages: Language[]=[];
  countries: Array<Object> = [];
  cities: string[] = [];
  states: Array<Object> = [];
  choosenCountry: string

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private route: Router,
              private storageService: StorageService,private httpClient:HttpClient) {
    for (let language in Language) {
      this.languages.push(<"AFAR" | "ABKHAZ" | "AVESTAN" | "AFRIKAANS" | "AKAN" | "AMHARIC" | "ARAGONESE" | "ARABIC" | "ASSAMESE" | "AVARIC" | "AYMARA" | "AZERBAIJANI" | "BASHKIR" | "BELARUSIAN" | "BULGARIAN" | "BIHARI" | "BISLAMA" | "BAMBARA" | "BENGALI" | "TIBETAN" | "BRETON" | "BOSNIAN" | "CATALAN" | "CHECHEN" | "CHAMORRO" | "CORSICAN" | "CREE" | "CZECH" | "OLD CHURCH SLAVONIC" | "CHUVASH" | "WELSH" | "DANISH" | "GERMAN" | "DIVEHI" | "DZONGKHA" | "EWE" | "GREEK" | "ENGLISH" | "ESPERANTO" | "SPANISH" | "ESTONIAN" | "BASQUE" | "PERSIAN" | "FULA" | "FINNISH" | "FIJIAN" | "FAROESE" | "FRENCH" | "WESTERN FRISIAN" | "IRISH" | "SCOTTISH GAELIC" | "GALICIAN" | "GUJARATI" | "MANX" | "HAUSA" | "HEBREW" | "HINDI" | "HIRI MOTU" | "CROATIAN" | "HAITIAN" | "HUNGARIAN" | "ARMENIAN" | "HERERO" | "INTERLINGUA" | "INDONESIAN" | "INTERLINGUE" | "IGBO" | "NUOSU" | "INUPIAQ" | "IDO" | "ICELANDIC" | "ITALIAN" | "INUKTITUT" | "JAPANESE" | "JAVANESE" | "GEORGIAN" | "KONGO" | "KIKUYU" | "KWANYAMA" | "KAZAKH" | "KALAALLISUT" | "KHMER" | "KANNADA" | "KOREAN" | "KANURI" | "KASHMIRI" | "KURDISH" | "KOMI" | "CORNISH" | "KYRGYZ" | "LATIN" | "LUXEMBOURGISH" | "GANDA" | "LIMBURGISH" | "LINGALA" | "LAO" | "LITHUANIAN" | "LUBA-KATANGA" | "LATVIAN" | "MALAGASY" | "MARSHALLESE" | "MĀORI" | "MACEDONIAN" | "MALAYALAM" | "MONGOLIAN" | "MARATHI" | "MALAY" | "MALTESE" | "BURMESE" | "NAURU" | "NORWEGIAN BOKMÅL" | "NORTHERN NDEBELE" | "NEPALI" | "NDONGA" | "DUTCH" | "NORWEGIAN NYNORSK" | "NORWEGIAN" | "SOUTHERN NDEBELE" | "NAVAJO" | "CHICHEWA" | "OCCITAN" | "OJIBWE" | "OROMO" | "ORIYA" | "OSSETIAN" | "PANJABI" | "PĀLI" | "POLISH" | "PASHTO" | "PORTUGUESE" | "QUECHUA" | "ROMANSH" | "KIRUNDI" | "ROMANIAN" | "RUSSIAN" | "KINYARWANDA" | "SANSKRIT" | "SARDINIAN" | "SINDHI" | "NORTHERN SAMI" | "SANGO" | "SINHALA" | "SLOVAK" | "SLOVENIAN" | "SHONA" | "SOMALI" | "ALBANIAN" | "SERBIAN" | "SWATI" | "SOUTHERN SOTHO" | "SUNDANESE" | "SWEDISH" | "SWAHILI" | "TAMIL" | "TELUGU" | "TAJIK" | "THAI" | "TIGRINYA" | "TURKMEN" | "TAGALOG" | "TSWANA" | "TONGA" | "TURKISH" | "TSONGA" | "TATAR" | "TWI" | "TAHITIAN" | "UYGHUR" | "UKRAINIAN" | "URDU" | "UZBEK" | "VENDA" | "VIETNAMESE" | "VOLAPÜK" | "WALLOON" | "WOLOF" | "XHOSA" | "YIDDISH" | "YORUBA" | "ZHUANG" | "CHINESE" | "ZULU">language.toUpperCase())
    }
    const headers = {'content-type': 'application/json', 'X-CSCAPI-KEY': `${environment.citiesApiKey}`};
    httpClient.get("https://api.countrystatecity.in/v1/countries", {headers: headers}).subscribe((data: Array<Object>) => {
      this.countries = data
      console.log(this.countries)
    })
  }

  ngOnInit(): void {
    this.token = this.storageService.getToken()
    this.authenticatedUser = this.storageService.getUser()
    this.createArtistAccountFormGroup = this.formBuilder.group({
      artistAccount: this.formBuilder.group({
        phoneNumber: new FormControl('', [Validators.required, Validators.minLength(3)]),
        workDays: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(3)]),
        city: new FormControl('', [Validators.required, Validators.minLength(3)]),
        country: new FormControl('', [Validators.required, Validators.minLength(3)]),
        state: new FormControl('', [Validators.required, Validators.minLength(3)]),
        postalCode: new FormControl('', [Validators.required, Validators.minLength(3)]),
        otherInformation: new FormControl('', [Validators.required, Validators.minLength(3)]),
        dateOfBirth: new FormControl('', [Validators.required]),
        gender:new FormControl('', [Validators.required]),
        careerDescription:new FormControl('', [Validators.required]),
        tattooStyles: new FormControl(''),
        languages:new FormControl('')
      })
    })
  }

  submit() {
    let artistAccountRequest:TattooArtistAccReqDto = this.createArtistAccountFormGroup.get('artistAccount').value;
        this.userService.createArtistAccount(artistAccountRequest, this.token).subscribe(res => {
          this.storageService.saveUser(res)
          this.authenticatedUser = this.storageService.getUser()
          if(res){
            this.route.navigateByUrl("/home").then()
          }
        }, error => {
          console.error(error)
        });

  }

  async onCountrySelection(country: any) {
    this.choosenCountry = country
    const headers = {'X-CSCAPI-KEY': `${environment.citiesApiKey}`};
    await this.httpClient.get(`https://api.countrystatecity.in/v1/countries/${country}/states`, {headers: headers}).subscribe(async (data: Array<Object>) => {
      this.states = await data
      console.log("states")
      console.log(this.states)
    })
  }

  async onStateSelection(state: string) {
    const headers = { 'X-CSCAPI-KEY': `${environment.citiesApiKey}`};
    await this.httpClient.get(`https://api.countrystatecity.in/v1/countries/${this.choosenCountry}/states/${state}/cities`, {headers: headers}).subscribe(async (data: Array<Object>) => {
      this.cities = await data.map(object => object['name'])
      console.log("cities")
      console.log(this.cities)
    })
  }

}
