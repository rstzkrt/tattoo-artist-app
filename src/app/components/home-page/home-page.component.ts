import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {TattooWorksResponseDto} from "../../generated-apis/tatoo-work";
import {PageEvent} from "@angular/material/paginator";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  tattooWorkList: Array<TattooWorksResponseDto> = new Array<TattooWorksResponseDto>()
  totalElements: number = 0;
  price:number=0;

  constructor(public userService: UserService,
              public authService: AuthService,
              private tattooWorkService: TattooWorkService,
              private tattooService:TattooWorkService,
              private router:ActivatedRoute) {

  }

  ngOnInit() {
    this.getTattoos(0,20)
  }

  private getTattoos(page:number,size:number) {
    this.tattooWorkService.getAllTattooWorks(page,size,this.price)
      .subscribe(data => {

          // for (let i = 0; i < 100; i++) {
          //   data[i]=data[1]
          // }

          this.tattooWorkList = data;
          this.totalElements = data.length;//
        }
        , error => {
          console.log(error.error.message);
        }
      );
  }
  nextPage(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.getTattoos(page,size);
  }

  delete(id:string){
    this.authService.getCurrentUser().getIdToken(true).then(token=>{
      this.tattooService.deleteTattooWork(id,token).subscribe(data=>{
        console.log(data)
      })
    })
  }

  likeTattooWork(id:string){
    this.authService.getCurrentUser().getIdToken(true).then(token=>{
      this.userService.likeTattooWork(id,token).subscribe(()=>{
          console.log("like")
      })
    })
  }

  disLikeTattooWork(id:string) {
    this.authService.getCurrentUser().getIdToken(true).then(token=>{
      this.userService.dislikeTattooWork(id,token).subscribe(()=>{
        console.log("dislike")
      })
    })
  }
}
