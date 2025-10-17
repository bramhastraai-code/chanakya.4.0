"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerAuthDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_customer_auth_dto_1 = require("./create-customer-auth.dto");
class UpdateCustomerAuthDto extends (0, swagger_1.PartialType)(create_customer_auth_dto_1.CreateCustomerAuthDto) {
}
exports.UpdateCustomerAuthDto = UpdateCustomerAuthDto;
//# sourceMappingURL=update-customer-auth.dto.js.map