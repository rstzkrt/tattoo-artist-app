/* tslint:disable */
/* eslint-disable */
import { WorkingDays } from './working-days';
export interface UserUpdateRequestDto {
  avatarUrl?: string;
  birthDate?: string;
  city?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  otherInformation?: string;
  phoneNumber?: string;
  postalCode?: string;
  state?: string;
  street?: string;
  workDays?: Array<WorkingDays>;
}
