export class UserRole{
  institution_key: string;
  user_role_key: string;
  role_name: string;
  modules_allowed: RoleModules[];
}

export class RoleModules{
  module_code: string;
  features_allowed: string[];
}
