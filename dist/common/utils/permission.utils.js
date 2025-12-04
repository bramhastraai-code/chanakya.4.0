"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = hasPermission;
const permission_enum_1 = require("src/role/enum/permission.enum");
async function hasPermission(role, resource, action) {
    if (!role.permissions || role.permissions.length === 0) {
        return false;
    }
    const permission = role.permissions.find((perm) => perm.resource === resource);
    if (!permission) {
        return false;
    }
    switch (action) {
        case permission_enum_1.CRUDPermission.CREATE:
            return permission.create;
        case permission_enum_1.CRUDPermission.READ:
            return permission.read;
        case permission_enum_1.CRUDPermission.UPDATE:
            return permission.update;
        case permission_enum_1.CRUDPermission.DELETE:
            return permission.delete;
        default:
            return false;
    }
}
//# sourceMappingURL=permission.utils.js.map