import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {TattooWorksResponseDto} from "../../generated-apis/tatoo-work";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

   tattooWorkList:Array<TattooWorksResponseDto>=new Array<TattooWorksResponseDto>()

  constructor(public userService:UserService, public authService:AuthService,private tattooWorkService:TattooWorkService) {

     this.tattooWorkService.getAllTattooWorks().subscribe((data)=>{
      this.tattooWorkList=data
      console.log(this.tattooWorkList.length)
    })

  }
  ngOnInit(): void {
  }
}
