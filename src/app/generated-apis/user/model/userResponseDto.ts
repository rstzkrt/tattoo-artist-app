/**
 * user-generated-contract
 * user-generated-contract
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Language } from './language';
import { Gender } from './gender';
import { WorkingDays } from './workingDays';


export interface UserResponseDto { 
    id?: string;
    /**
     * id for firebase auth
     */
    uid?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    birthDate?: string;
    email?: string;
    hasArtistPage?: boolean;
    workDays?: Array<WorkingDays>;
    averageRating?: number;
    phoneNumber?: string;
    street?: string;
    city?: string;
    country?: string;
    state?: string;
    postalCode?: string;
    otherInformation?: string;
    favoriteArtistIds?: Array<string>;
    favoriteTattooWorkIds?: Array<string>;
    commentIds?: Array<string>;
    tattooWorkIds?: Array<string>;
    careerDescription?: string;
    gender?: Gender;
    languages?: Array<Language>;
}

