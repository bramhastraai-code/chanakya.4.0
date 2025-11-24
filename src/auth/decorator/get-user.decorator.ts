import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return null;
    // If a specific property is requested, return only that
    if (data) {
      return user[data as keyof typeof user];
    }
    // Remove sensitive fields if present
    if (user.password) delete user.password;
    if (user.refreshToken) delete user.refreshToken;
    return user;
  },
);
