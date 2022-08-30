import { Injectable } from '@angular/core';
import {
  DefaultService,
  TattooWorkPatchRequestDto,
  TattooWorkPostRequestDto,
  TattooWorksResponseDto
} from "../generated-apis/tatoo-work";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class TattooWorkService{

  private _rootUrl: string="http://localhost:8080";

  constructor(private tattooWorkService:DefaultService) {
    tattooWorkService.configuration.basePath=this._rootUrl;
  }

  createTattooWork(tattooWorkPostRequestDto: TattooWorkPostRequestDto): Observable<TattooWorksResponseDto> {
    return this.tattooWorkService.createTattooWork(tattooWorkPostRequestDto);
  }

  deleteTattooWork(id: string): Observable<any> {
    return this.tattooWorkService.deleteTattooWork(id)
  }

  getAllTattooWorks(country?: string, price?: number): Observable<Array<TattooWorksResponseDto>> {
    return this.tattooWorkService.getAllTattooWorks(country,price)
  }

  getTattooWorkById(id: string): Observable<TattooWorksResponseDto> {
    return this.tattooWorkService.getTattooWorkById(id)
  }

  patchTattooWork(id: string, tattooWorkPatchRequestDto: TattooWorkPatchRequestDto): Observable<TattooWorksResponseDto> {
    return this.tattooWorkService.patchTattooWork(id,tattooWorkPatchRequestDto)
  }
}
