import { GqlExecutionContext } from '@nestjs/graphql';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRoles } from './../../common/types/user-roles';
import { User } from './../../users/entities/user.entity';
import { ROLES_META } from './../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const validRoles = this.reflector.get<UserRoles[]>(ROLES_META, ctx.getHandler());

    if (!validRoles || validRoles.length === 0) return true;

    const user: User = ctx.getContext().req.user;

    if (!user)
      throw new InternalServerErrorException(`No user inside the request, make sure that we used the AuthGuard`);

    if (validRoles.some((r) => user.roles.includes(r))) return true;

    throw new ForbiddenException(`User ${user.username} need a valid role [${validRoles}]`);
  }
}
