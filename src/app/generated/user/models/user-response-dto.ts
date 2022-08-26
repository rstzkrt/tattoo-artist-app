/* tslint:disable */
/* eslint-disable */
import { WorkingDays } from './working-days';
export interface UserResponseDto {
  avatarUrl?: string;
  averageRating?: number;
  birthDate?: string;
  city?: string;
  commentIds?: Array<string>;
  country?: string;
  email?: string;
  favoriteArtistIds?: Array<string>;
  favoriteTattooWorkIds?: Array<string>;
  firstName?: string;
  hasArtistPage?: boolean;
  id?: string;
  lastName?: string;
  otherInformation?: string;
  phoneNumber?: string;
  postalCode?: string;
  state?: string;
  street?: string;
  tattooWorkIds?: Array<string>;

  /**
   * id for firebase auth
   */
  uid?: string;
  workDays?: Array<WorkingDays>;
}
