import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enum/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

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
      this.logger.log('No user found in request');
      return false;
    }

    this.logger.log(
      `User role: ${user.role}, Type: ${typeof user.role}`,
    );
    this.logger.log(`Required roles: ${requiredRoles}`);
    this.logger.log(
      `Comparison results: ${JSON.stringify(requiredRoles.map((role) => ({
        role,
        type: typeof role,
        matches: user.role === role,
        strictMatch: user.role === role,
        looseMatch: String(user.role) === String(role),
      })))}`,
    );

    const hasRole = requiredRoles.some((role) => user.role === role);
    this.logger.log(`Access granted: ${hasRole}`);

    return hasRole;
  }
}
