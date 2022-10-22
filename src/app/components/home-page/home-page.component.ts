import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {TattooWorksResponseDto} from "../../generated-apis/tatoo-work";
import {PageEvent} from "@angular/material/paginator";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../../common/user";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {Currency, Gender, Language, TattooStyle, UserDocumentDto, UserResponseDto} from "../../generated-apis/user";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {FormControl, FormGroup} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  tattooWorkList: Array<TattooWorksResponseDto>
  userList: Array<UserResponseDto> = []
  TattooWorkTotalElements: number = 0;
  TattooArtistTotalElements: number = 0;
  token: string
  authenticatedUser: User;
  filteredUsers: Map<string, UserDocumentDto> = new Map<string, UserDocumentDto>();
  tattooArtistPage:number=0
  tattooArtistSize:number=20
  tattooWorkPage:number=0
  tattooWorkSize:number=20

  //
  artistSearchInput: string
  city: string
  country: string
  isTattooArtist: boolean
  languages: string[]
  averageRating: number
  gender: Gender
  countries: Array<Object> = [];
  states: Array<Object> = [];
  searchTattooArtistModeOn: boolean = false;

  //
  tattooWorkSearchInput: string
  minPrice: number;
  maxPrice: number;
  currency: string;
  tattooStyle: string;
  tattooStyles: TattooStyle[] = [TattooStyle.Tribal, TattooStyle.Tribal, TattooStyle.AsianOriental, TattooStyle.Biomechanical, TattooStyle.DotWork, TattooStyle.Script, TattooStyle.BlackAndGrey, TattooStyle.NewSchool, "OLD_SCHOOL", TattooStyle.Portraits, "WATERCOLOUR", TattooStyle.Realistic];
  currencies: string[] = [];
  filteredOptions: Observable<string[]>;
  currencyFormGroup: FormGroup;
  gendersFilter: Gender[] = [Gender.Female, Gender.Male];
  languagesFilter: Language[] = [];
  ratingsFilter: number[] = [1, 2, 3, 4, 5];
  searchTattooWorkModeOn: boolean = false;

  constructor(public userService: UserService,
              public authService: AuthService,
              private tattooWorkService: TattooWorkService,
              private tattooService: TattooWorkService,
              public afAuth: AngularFireAuth,
              private storageService: StorageService,
              private route: Router,
              private httpClient: HttpClient) {
    this.getUsers(0, 20)
    this.getTattoos(0, 20)
    const headers = {'content-type': 'application/json', 'X-CSCAPI-KEY': `${environment.citiesApiKey}`};
    httpClient.get("https://api.countrystatecity.in/v1/countries", {headers: headers}).subscribe((data: Array<Object>) => {
      this.countries = data
    })
    for (let currency in Currency) {
      this.currencies.push(<"AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" | "AZN" | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BOV" | "BRL" | "BSD" | "BTC" | "BTN" | "BWP" | "BYR" | "BYN" | "BZD" | "CAD" | "CDF" | "CHE" | "CHF" | "CHW" | "CLF" | "CLP" | "CNY" | "COP" | "COU" | "CRC" | "CUC" | "CUP" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EGP" | "ERN" | "ETB" | "EUR" | "FJD" | "FKP" | "GBP" | "GEL" | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "IQD" | "IRR" | "ISK" | "JMD" | "JOD" | "JPY" | "KES" | "KGS" | "KHR" | "KMF" | "KPW" | "KRW" | "KWD" | "KYD" | "KZT" | "LAK" | "LBP" | "LKR" | "LRD" | "LSL" | "LTL" | "LVL" | "LYD" | "MAD" | "MDL" | "MGA" | "MKD" | "MMK" | "MNT" | "MOP" | "MRO" | "MRU" | "MUR" | "MVR" | "MWK" | "MXN" | "MXV" | "MYR" | "MZN" | "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD" | "OMR" | "PAB" | "PEN" | "PGK" | "PHP" | "PKR" | "PLN" | "PYG" | "QAR" | "RON" | "RSD" | "RUB" | "RWF" | "SAR" | "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SHP" | "SLL" | "SOS" | "SRD" | "STD" | "STN" | "SVC" | "SYP" | "SZL" | "THB" | "TJS" | "TMT" | "TND" | "TOP" | "TRY" | "TTD" | "TWD" | "TZS" | "UAH" | "UGX" | "USD" | "USN" | "UYI" | "UYU" | "UYW" | "UZS" | "VED" | "VEF" | "VES" | "VND" | "VUV" | "WST" | "XAG" | "XAU" | "XAF" | "XBA" | "XBB" | "XBC" | "XBD" | "XCD" | "XDR" | "XOF" | "XPD" | "XPF" | "XPT" | "XSU" | "XTS" | "XUA" | "XXX" | "YER" | "ZAR" | "ZMK" | "ZWL" | "ZMW" | "SSP">currency.toUpperCase())
    }
    for (let language in Language) {
      this.languagesFilter.push(<"AFAR" | "ABKHAZ" | "AVESTAN" | "AFRIKAANS" | "AKAN" | "AMHARIC" | "ARAGONESE" | "ARABIC" | "ASSAMESE" | "AVARIC" | "AYMARA" | "AZERBAIJANI" | "BASHKIR" | "BELARUSIAN" | "BULGARIAN" | "BIHARI" | "BISLAMA" | "BAMBARA" | "BENGALI" | "TIBETAN" | "BRETON" | "BOSNIAN" | "CATALAN" | "CHECHEN" | "CHAMORRO" | "CORSICAN" | "CREE" | "CZECH" | "OLD CHURCH SLAVONIC" | "CHUVASH" | "WELSH" | "DANISH" | "GERMAN" | "DIVEHI" | "DZONGKHA" | "EWE" | "GREEK" | "ENGLISH" | "ESPERANTO" | "SPANISH" | "ESTONIAN" | "BASQUE" | "PERSIAN" | "FULA" | "FINNISH" | "FIJIAN" | "FAROESE" | "FRENCH" | "WESTERN FRISIAN" | "IRISH" | "SCOTTISH GAELIC" | "GALICIAN" | "GUJARATI" | "MANX" | "HAUSA" | "HEBREW" | "HINDI" | "HIRI MOTU" | "CROATIAN" | "HAITIAN" | "HUNGARIAN" | "ARMENIAN" | "HERERO" | "INTERLINGUA" | "INDONESIAN" | "INTERLINGUE" | "IGBO" | "NUOSU" | "INUPIAQ" | "IDO" | "ICELANDIC" | "ITALIAN" | "INUKTITUT" | "JAPANESE" | "JAVANESE" | "GEORGIAN" | "KONGO" | "KIKUYU" | "KWANYAMA" | "KAZAKH" | "KALAALLISUT" | "KHMER" | "KANNADA" | "KOREAN" | "KANURI" | "KASHMIRI" | "KURDISH" | "KOMI" | "CORNISH" | "KYRGYZ" | "LATIN" | "LUXEMBOURGISH" | "GANDA" | "LIMBURGISH" | "LINGALA" | "LAO" | "LITHUANIAN" | "LUBA-KATANGA" | "LATVIAN" | "MALAGASY" | "MARSHALLESE" | "MĀORI" | "MACEDONIAN" | "MALAYALAM" | "MONGOLIAN" | "MARATHI" | "MALAY" | "MALTESE" | "BURMESE" | "NAURU" | "NORWEGIAN BOKMÅL" | "NORTHERN NDEBELE" | "NEPALI" | "NDONGA" | "DUTCH" | "NORWEGIAN NYNORSK" | "NORWEGIAN" | "SOUTHERN NDEBELE" | "NAVAJO" | "CHICHEWA" | "OCCITAN" | "OJIBWE" | "OROMO" | "ORIYA" | "OSSETIAN" | "PANJABI" | "PĀLI" | "POLISH" | "PASHTO" | "PORTUGUESE" | "QUECHUA" | "ROMANSH" | "KIRUNDI" | "ROMANIAN" | "RUSSIAN" | "KINYARWANDA" | "SANSKRIT" | "SARDINIAN" | "SINDHI" | "NORTHERN SAMI" | "SANGO" | "SINHALA" | "SLOVAK" | "SLOVENIAN" | "SHONA" | "SOMALI" | "ALBANIAN" | "SERBIAN" | "SWATI" | "SOUTHERN SOTHO" | "SUNDANESE" | "SWEDISH" | "SWAHILI" | "TAMIL" | "TELUGU" | "TAJIK" | "THAI" | "TIGRINYA" | "TURKMEN" | "TAGALOG" | "TSWANA" | "TONGA" | "TURKISH" | "TSONGA" | "TATAR" | "TWI" | "TAHITIAN" | "UYGHUR" | "UKRAINIAN" | "URDU" | "UZBEK" | "VENDA" | "VIETNAMESE" | "VOLAPÜK" | "WALLOON" | "WOLOF" | "XHOSA" | "YIDDISH" | "YORUBA" | "ZHUANG" | "CHINESE" | "ZULU">language.trim().toUpperCase())
    }
  }

  ngOnInit(): void {
    this.token = this.storageService.getToken()
    this.authenticatedUser = this.storageService.getUser()
    if (this.maxPrice == 0) this.maxPrice = null
    if (this.minPrice == 0) this.minPrice = null
    this.currencyFormGroup = new FormGroup({
      currencyGroup: new FormGroup({
        currency: new FormControl(null)
      })
    })
    this.filteredOptions = this.currencyFormGroup.get('currencyGroup').get('currency').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }

  private getUsers(page: number, size: number) {
    if (this.searchTattooArtistModeOn === true) {
      this.userService.searchUsers(this.artistSearchInput,page,size, this.city, this.country, true, this.averageRating, this.languages, this.gender).subscribe(data => {
        if (data.totalElements === 0) {
          this.userList = []
        }else {
          this.userList=data.tattooArtists
          this.TattooArtistTotalElements = data.totalElements;
        }
      })
    } else {
      this.userService.getAllUsers(page, size).subscribe(data => {
        this.userList = data.tattooArtists
        this.TattooArtistTotalElements = data.totalElements;
      })
    }

  }

  private getTattoos(page: number, size: number) {
    if (this.searchTattooWorkModeOn === true) {
      this.tattooService.searchTattooWorks(page,size,this.tattooWorkSearchInput, this.minPrice, this.maxPrice, this.currency, this.tattooStyle).subscribe(data => {
        this.tattooWorkList = data.tattooWorks;
        this.TattooWorkTotalElements = data.totalElements;
      })
    } else {
      this.tattooWorkService.getAllTattooWorks(page, size, 0).subscribe(data => {
        this.tattooWorkList = data.tattooWorks
        this.TattooWorkTotalElements = data.totalElements;
      })
    }
  }

  nextPageUser(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.tattooArtistPage = page
    this.tattooArtistSize = size;
    if(this.searchTattooArtistModeOn===true){
      this.getUsers(this.tattooArtistPage, this.tattooArtistSize);
    }else {
      this.getUsers(page, size);
    }
  }

  nextPageTattooWork(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.tattooWorkPage = page
    this.tattooWorkSize = size;
    if(this.searchTattooWorkModeOn===true) {
      this.getTattoos(this.tattooWorkPage, this.tattooWorkSize);
    }else {
      this.getTattoos(page, size);
    }
  }

  delete(id: string) {
    this.tattooService.deleteTattooWork(id, this.token).subscribe(data => {
      this.fetchUser()
      console.log(data)
    })
  }

  fetchUser(): void {
    this.userService.fetchAuthenticatedUser(this.token).subscribe(user => {
      this.storageService.saveUser(user)
      this.authenticatedUser = user
    })
  }

  likeTattooWork(id: string) {
    this.userService.likeTattooWork(id, this.token).subscribe(() => {
      this.fetchUser()
      this.getTattoos(0, 20)//
      console.log("like")
    })
  }

  disLikeTattooWork(id: string) {
    this.token = this.storageService.getToken()
    this.userService.dislikeTattooWork(id, this.token).subscribe(() => {
      this.fetchUser()
      if(this.searchTattooWorkModeOn===true){
        this.getTattoos(this.tattooWorkPage, this.tattooWorkSize)

      }else{
        this.getTattoos(0, 20)
      }
      console.log("dislike")
    })
  }

  favoriteTattooWork(tattoo_work_id: string) {
    this.userService.favoriteTattooWork(tattoo_work_id, this.token).subscribe(() => {
      this.fetchUser()
      this.getTattoos(0, 20)//
      console.log("favorite")
    })
  }

  unFavoriteTattooWork(tattoo_work_id: string) {
    this.userService.unfavoriteTattooWork(tattoo_work_id, this.token).subscribe(() => {
      this.fetchUser()
      this.getTattoos(0, 20) //
    })
  }

  favoriteTattooArtist(tattoo_artist_id: string) {
    this.userService.favoriteTattooArtist(tattoo_artist_id, this.token).subscribe(() => {
      this.fetchUser()
    })
  }

  unFavoriteTattooArtist(tattoo_artist_id: string) {
    this.userService.unfavoriteTattooArtist(tattoo_artist_id, this.token).subscribe(() => {
      this.fetchUser()
    })
  }

  clearFilters() {
    this.searchTattooArtistModeOn = false;
    this.searchTattooWorkModeOn = false;
    this.currency=null;
    this.country=null;
    this.city=null;
    this.gender=null;
    this.artistSearchInput=null
    this.isTattooArtist =null
    this.languages=null
    this.averageRating=null
    this.countries=null
    this.states= null
    this.tattooWorkSearchInput= null
    this.minPrice=null
    this.maxPrice= null
    this.tattooStyle= null
    this.tattooStyles=null
    this.currencies= null
    this.filteredOptions = null
    this.currencyFormGroup =null
    this.gendersFilter =null
    this.languagesFilter = null
    this.ratingsFilter= null
    this.getUsers(0, 20);
    this.getTattoos(0, 20);
  }

  searchArtist(input: string) {
    this.searchTattooArtistModeOn = true;
    this.artistSearchInput = input
    this.userService.searchUsers(this.artistSearchInput,this.tattooArtistPage,this.tattooArtistSize, this.city, this.country, true, this.averageRating, this.languages, this.gender).subscribe(data => {
      if (data.totalElements === 0) {
        this.userList = []
      }else {
        this.userList=data.tattooArtists
        this.TattooArtistTotalElements = data.totalElements;
      }}
    )
  }

  searchTattooWork(value: string) {
    this.searchTattooWorkModeOn = true;
    this.tattooWorkSearchInput = value
    this.tattooService.searchTattooWorks(this.tattooWorkPage,this.tattooWorkSize,value, this.minPrice, this.maxPrice, this.currency, this.tattooStyle).subscribe(data => {
      this.tattooWorkList = data.tattooWorks;
      this.TattooWorkTotalElements=data.totalElements
    })
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  private _filter(value: string): string[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.currencies.filter(option => option.toLowerCase().includes(filterValue));
  }

  async onCountrySelection(countryElement: any) {
    const headers = {'X-CSCAPI-KEY': `${environment.citiesApiKey}`};
    await this.httpClient.get(`https://api.countrystatecity.in/v1/countries/${countryElement}/states`, {headers: headers}).subscribe(async (data: Array<Object>) => {
      this.states = await data
    })
  }
}
