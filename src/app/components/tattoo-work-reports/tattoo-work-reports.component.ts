import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ActivatedRoute} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {TattooWorkReportService} from "../../services/tattoo-work-report.service";
import {TattooWorkReportResDto} from "../../generated-apis/tattoo-work-report";
import {TattooWorkService} from "../../services/tattoo-work.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-tattoo-work-reports',
  templateUrl: './tattoo-work-reports.component.html',
  styleUrls: ['./tattoo-work-reports.component.css']
})
export class TattooWorkReportsComponent implements OnInit {

  displayedColumns: string[] = [ 'id', 'date','description','reportOwner','reportedTattooWork'];
  tattooWorkReportRequests:TattooWorkReportResDto[];
  TotalElements: number;
  page: number;
  size: number;

  constructor(public dialog: MatDialog,
              private tattooWorkReportService: TattooWorkReportService,
              private afAuth: AngularFireAuth,
              private route: ActivatedRoute,
              private storageService:StorageService,
              private tattooWorkService:TattooWorkService) {

    this.getUserReportsPageable(0,20)
  }

  ngOnInit(): void {

  }

  closeCase(id:string) {
    this.tattooWorkReportService.removeTattooWorkReport(id,this.storageService.getToken()).subscribe(data=>{
      this.getUserReportsPageable(this.page,this.size)
    })
  }

  removeTattooWork(id) {
    this.tattooWorkService.deleteTattooWork(id,this.storageService.getToken()).subscribe(data=>{
      this.getUserReportsPageable(this.page,this.size)
    })
  }

  private getUserReportsPageable(page: number, size: number) {
    this.tattooWorkReportService.getAllTattooWorkReports(page, size,this.storageService.getToken()).subscribe(data => {
      this.tattooWorkReportRequests = data.tattooWorkReports
      this.TotalElements = data.totalElements;
    })
  }

  nextPageTattooWorkReport(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    this.page = page
    this.size = size;
    this.getUserReportsPageable(page,size);
  }
}
