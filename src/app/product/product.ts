
export class Product {
  product_key : string;
  name : string;
  demographic_configuration : DemographicConfiguration;
  modules : Module[];
}

export class DemographicConfiguration{
  professions : Profession[];
  castes : Caste[];
  religions : Religion[];
  educationLevels : EducationLevel[];
  marital_status: MaritalStatus[];
}

export class MaritalStatus {
  code: string;
  name: string;
}

export class EducationLevel {
  code: string;
  desc: string;
}

export class Caste{
  code : string;
  name : string;
}

export class Religion{
  code : string;
  name : string;
}

export class Profession{
  code : string;
  name : string;
}

export class Module{
  code : string;
  features_list : Features[];
  name : string;
}

export class Features{
  rest_request : RestRequest;
  code : string;
  webapp_url : string;
  name : string;
}

export class RestRequest{
  method : string;
  url : string;
}
