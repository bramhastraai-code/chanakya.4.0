import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enum/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      console.log('[RolesGuard] No user found in request');
      return false;
    }

    console.log(
      '[RolesGuard] User role:',
      user.role,
      'Type:',
      typeof user.role,
    );
    console.log('[RolesGuard] Required roles:', requiredRoles);
    console.log(
      '[RolesGuard] Comparison results:',
      requiredRoles.map((role) => ({
        role,
        type: typeof role,
        matches: user.role === role,
        strictMatch: user.role === role,
        looseMatch: String(user.role) === String(role),
      })),
    );

    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('[RolesGuard] Access granted:', hasRole);

    return hasRole;
  }
}
