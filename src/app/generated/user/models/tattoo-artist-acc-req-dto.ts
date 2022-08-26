/* tslint:disable */
/* eslint-disable */
import { WorkingDays } from './working-days';
export interface TattooArtistAccReqDto {
  city?: string;
  country?: string;
  otherInformation?: string;
  phoneNumber?: string;
  postalCode?: string;
  state?: string;
  street?: string;
  workDays?: Array<WorkingDays>;
}
