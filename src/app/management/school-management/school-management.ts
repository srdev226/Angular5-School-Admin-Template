export class SchoolManagement {
  name: string;
  school_management_key: string;
  schools_under_management: SchoolsUnderManagement[] = [];
  institutions_under_management: InstitutionsUnderManagement[] = [];
  fee_configuration: FeeConfiguration;
}

export class SchoolsUnderManagement{
      school_id: string;
}

export class InstitutionsUnderManagement{
      institution_key: string;
}

export class FeeConfiguration{
  fee_types: FeeConfigType[];
}

export class FeeConfigType{
  code: string;
  name: string;
}
