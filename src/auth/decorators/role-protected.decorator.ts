import { SetMetadata } from '@nestjs/common';
import { UserRoles } from './../../common/types/user-roles';

export const ROLES_META = 'roles';

export const RoleProtected = (...args: UserRoles[]) =>
  SetMetadata(ROLES_META, args);
