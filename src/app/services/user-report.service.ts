import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DefaultService, UserReportPatchReqDto, UserReportPostReqDto} from "../generated-apis/user-report";

@Injectable({
  providedIn: 'root'
})
export class UserReportService {

  private _rootUrl: string="http://tattoo-api.us-east-1.elasticbeanstalk.com";
  // private _rootUrl: string="http://localhost:8080";

  constructor(private httpClient:HttpClient, private userReportService:DefaultService) {
    userReportService.configuration.basePath=this._rootUrl;
  }

  closeReport(id: string,token:string){
    this.userReportService.configuration.credentials= {"bearerAuth": token};
   return this.userReportService.closeReport(id)
  }

  createUserReport(userReportPostReqDto: UserReportPostReqDto ,token:string){
    this.userReportService.configuration.credentials= {"bearerAuth": token};
    return this.userReportService.createUserReport(userReportPostReqDto)
  }

  getAllUserReports(page: number, size: number, token:string) {
    this.userReportService.configuration.credentials= {"bearerAuth": token};
    return this.userReportService.getAllUserReports(page, size)
  }

  getUserReportById(id: string,token:string){
    this.userReportService.configuration.credentials= {"bearerAuth": token};
   return  this.userReportService.getUserReportById(id)
  }

  updateUserReport(id: string, userReportPatchReqDto: UserReportPatchReqDto,token:string){
    this.userReportService.configuration.credentials= {"bearerAuth": token};
    return this.userReportService.updateUserReport(id,userReportPatchReqDto)
  }
}
