import { Role } from 'src/role/entity/role.entity'; // Ensure the correct path
import { CRUDPermission } from 'src/role/enum/permission.enum'; // Ensure the correct path

// Function to check if a role has the specified permission
export async function hasPermission(
  role: Role,
  resource: string,
  action: CRUDPermission,
): Promise<boolean> {
  // Ensure role has permissions
  if (!role.permissions || role.permissions.length === 0) {
    return false;
  }

  // Find the permission object for the given resource
  const permission = role.permissions.find(
    (perm) => perm.resource === resource,
  );

  // If no permission object for the resource is found, return false
  if (!permission) {
    return false;
  }

  // Check if the specific action is allowed based on the permission object
  switch (action) {
    case CRUDPermission.CREATE:
      return permission.create;
    case CRUDPermission.READ:
      return permission.read;
    case CRUDPermission.UPDATE:
      return permission.update;
    case CRUDPermission.DELETE:
      return permission.delete;
    default:
      return false;
  }
}

/**
import { Injectable } from '@nestjs/common';
import { Role } from 'src/role/entity/role.entity';  // Ensure the correct path
import { CRUDPermission } from 'src/role/enum/permission.enum';  // Ensure the correct path
import { hasPermission } from './has-permission.function';  // Ensure the correct path

@Injectable()
export class SomeService {
  async someMethod(role: Role) {
    const canCreate = await hasPermission(role, 'USER', CRUDPermission.CREATE);
    if (canCreate) {
      // Perform action
    }
  }
}
*/
