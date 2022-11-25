import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtGraphqlGuard } from './../guards/jwt-auth.guard';

import { UserRoles } from './../../common/types/user-roles';
import { UserRoleGuard } from './../guards/user-role.guard';
import { ROLES_META } from './role-protected.decorator';

export function Auth(...roles: UserRoles[]) {
  return applyDecorators(
    SetMetadata(ROLES_META, roles),
    UseGuards(JwtGraphqlGuard, UserRoleGuard),
  );
}
