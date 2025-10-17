"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBuilderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_builder_dto_1 = require("./create-builder.dto");
class UpdateBuilderDto extends (0, swagger_1.PartialType)(create_builder_dto_1.CreateBuilderDto) {
}
exports.UpdateBuilderDto = UpdateBuilderDto;
//# sourceMappingURL=update-builder.dto.js.map