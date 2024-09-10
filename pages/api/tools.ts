// data types required so we can submit data to our APIs

/**
 * @description This object is passed to the departmenrt of Agriculture API in ireland to register Calves
 * @param tagNumber `string` The tag number of the calf. This can be the 5 digits of the tag either
 * @param sex `string` The sex of the calf
 * @param breed `string` The breed of the calf sire
 * @param dateOfBirth `string` The date of birth of the calf
 * @param damTagNumber `string` The tag number of the dam. This can be the 5 digits of the tag either
 * @param pedigree `string` The pedigree of the calf. This is optional and can be left blank
 */
export interface RegisterCalf {
  tagNumber: string;
  sex: string;
  breed: string;
  dateOfBirth: string;
  damTagNumber: string;
  pedigree?: string;
}

type socialPlatforms = "Facebook" | "Tiktok" | "Instagram" | "Twitter";

/**
 * @description This object to passed to social media APIs to post to social media
 * @param message `string` The message to be posted to social media
 * @param mediaUrls `string[]` The media to be posted to social media. This is optional and can be left blank
 * @param socialPlatforms `socialPlatforms[]` The platforms to post to. This is optional and can be left blank and the default is to post to all platforms
 * @param schedule `string` The date and time to post to social media in ISO 8601 format. This is optional and can be left blank
 */
export interface PostToSocialMedia {
  message: string;
  mediaUrls?: string[];
  socialPlatforms?: socialPlatforms[];
  schedule?: string;
}
