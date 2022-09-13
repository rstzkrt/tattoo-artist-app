import {Component, OnInit} from '@angular/core';
import {TattooWorkService} from "../../services/tattoo-work.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TattooWorkPatchRequestDto} from "../../generated-apis/tatoo-work";
import {Currency} from "../../generated-apis/user";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

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

  constructor(private tattooService: TattooWorkService,
              private router: ActivatedRoute,
              private authService: AuthService) {
    this.tattooWorkId = this.router.snapshot.paramMap.get('id')
    for (let currency in Currency) {
      this.currencies.push(<"AED" | "AFN" | "ALL" | "AMD" | "ANG" | "AOA" | "ARS" | "AUD" | "AWG" | "AZN" | "BAM" | "BBD" | "BDT" | "BGN" | "BHD" | "BIF" | "BMD" | "BND" | "BOB" | "BOV" | "BRL" | "BSD" | "BTC" | "BTN" | "BWP" | "BYR" | "BYN" | "BZD" | "CAD" | "CDF" | "CHE" | "CHF" | "CHW" | "CLF" | "CLP" | "CNY" | "COP" | "COU" | "CRC" | "CUC" | "CUP" | "CVE" | "CZK" | "DJF" | "DKK" | "DOP" | "DZD" | "EGP" | "ERN" | "ETB" | "EUR" | "FJD" | "FKP" | "GBP" | "GEL" | "GHS" | "GIP" | "GMD" | "GNF" | "GTQ" | "GYD" | "HKD" | "HNL" | "HRK" | "HTG" | "HUF" | "IDR" | "ILS" | "INR" | "IQD" | "IRR" | "ISK" | "JMD" | "JOD" | "JPY" | "KES" | "KGS" | "KHR" | "KMF" | "KPW" | "KRW" | "KWD" | "KYD" | "KZT" | "LAK" | "LBP" | "LKR" | "LRD" | "LSL" | "LTL" | "LVL" | "LYD" | "MAD" | "MDL" | "MGA" | "MKD" | "MMK" | "MNT" | "MOP" | "MRO" | "MRU" | "MUR" | "MVR" | "MWK" | "MXN" | "MXV" | "MYR" | "MZN" | "NAD" | "NGN" | "NIO" | "NOK" | "NPR" | "NZD" | "OMR" | "PAB" | "PEN" | "PGK" | "PHP" | "PKR" | "PLN" | "PYG" | "QAR" | "RON" | "RSD" | "RUB" | "RWF" | "SAR" | "SBD" | "SCR" | "SDG" | "SEK" | "SGD" | "SHP" | "SLL" | "SOS" | "SRD" | "STD" | "STN" | "SVC" | "SYP" | "SZL" | "THB" | "TJS" | "TMT" | "TND" | "TOP" | "TRY" | "TTD" | "TWD" | "TZS" | "UAH" | "UGX" | "USD" | "USN" | "UYI" | "UYU" | "UYW" | "UZS" | "VED" | "VEF" | "VES" | "VND" | "VUV" | "WST" | "XAG" | "XAU" | "XAF" | "XBA" | "XBB" | "XBC" | "XBD" | "XCD" | "XDR" | "XOF" | "XPD" | "XPF" | "XPT" | "XSU" | "XTS" | "XUA" | "XXX" | "YER" | "ZAR" | "ZMK" | "ZWL" | "ZMW" | "SSP">currency.toUpperCase())
    }
  }

   ngOnInit() :void {
    this.tattooService.getTattooWorkById(this.tattooWorkId).subscribe( tattooWork => {
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
    tattooWorkPatch.photos=[]//TODO
    this.authService.getCurrentUser().getIdToken().then(token => {
      this.tattooService.patchTattooWork(this.tattooWorkId, tattooWorkPatch, token).subscribe(data => {
        console.log(data)
      })
    })
  }
}
