import {PhoneNumber} from '../common/phone-number';

export class ContactInfo {
  contact_key: string;
  full_name: string;
  profile_image_url: string;
  gender : string;
  id_code: string;
  notification_mobile_numbers: PhoneNumber[];
}
