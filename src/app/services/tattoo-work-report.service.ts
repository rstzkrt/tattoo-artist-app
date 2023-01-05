import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  DefaultService,
  TattooWorkReportPatchReqDto,
  TattooWorkReportPostReqDto
} from "../generated-apis/tattoo-work-report";

@Injectable({
  providedIn: 'root'
})
export class TattooWorkReportService {

  private _rootUrl: string="http://tattoo-api.us-east-1.elasticbeanstalk.com";

  constructor(private httpClient:HttpClient, private tattooWorkReportService:DefaultService) {
    tattooWorkReportService.configuration.basePath=this._rootUrl;
  }

  createTattooWorkReport(tattooWorkReportPostReqDto:TattooWorkReportPostReqDto,token:string){
    this.tattooWorkReportService.configuration.credentials= {"bearerAuth": token};
    return  this.tattooWorkReportService.createTattooWorkReport(tattooWorkReportPostReqDto)
  }

  getAllTattooWorkReports(page: number, size: number,token:string){
    this.tattooWorkReportService.configuration.credentials= {"bearerAuth": token};
    return this.tattooWorkReportService.getAllTattooWorkReports(page,size)
  }

  getTattooWorkReportById(id: string,token:string){
    this.tattooWorkReportService.configuration.credentials= {"bearerAuth": token};
    return this.tattooWorkReportService.getTattooWorkReportById(id)
  }

  removeTattooWorkReport(id: string,token:string){
    this.tattooWorkReportService.configuration.credentials= {"bearerAuth": token};
    return this.tattooWorkReportService.removeTattooWorkReport(id)
  }

  updateTattooWorkReport(id: string, tattooWorkReportPatchReqDto: TattooWorkReportPatchReqDto,token:string){
    this.tattooWorkReportService.configuration.credentials= {"bearerAuth": token};
    return this.tattooWorkReportService.updateTattooWorkReport(id,tattooWorkReportPatchReqDto)

  }
}
