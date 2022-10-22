import { Component, OnInit } from '@angular/core';
import {UserReportResDto} from "../../generated-apis/user-report";
import {MatDialog} from "@angular/material/dialog";
import {UserReportService} from "../../services/user-report.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ActivatedRoute} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {PageEvent} from "@angular/material/paginator";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.css']
})
export class UserReportsComponent implements OnInit {

  displayedColumns: string[] = [ 'id', 'date','description','reportOwner','reportedUser'];
  userReportRequests:UserReportResDto[];
  TotalElements: number;
  page:number
  size:number


  constructor(public dialog: MatDialog,
              private userReportService: UserReportService,
              private afAuth: AngularFireAuth,
              private route: ActivatedRoute,
              private storageService:StorageService,
              private userService:UserService) {
    this.getUserReportsPageable(0,20);
  }

  ngOnInit(): void {
  }

  closeCase(id:string) {
    this.userReportService.closeReport(id,this.storageService.getToken()).subscribe(data=>{
      this.getUserReportsPageable(this.page,this.size)
    })
  }

  removeUser(id) {
    this.userService.deleteById(id,this.storageService.getToken()).subscribe(data=>{
      this.getUserReportsPageable(this.page,this.size)
    })
  }

  private getUserReportsPageable(page: number, size: number) {
    this.userReportService.getAllUserReports(page, size,this.storageService.getToken()).subscribe(data => {
      this.userReportRequests = data.userReports
      this.TotalElements = data.totalElements;
    })
  }

  nextPageUserReport(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.page = page
    this.size = size;
    this.getUserReportsPageable(page,size);
  }
}
