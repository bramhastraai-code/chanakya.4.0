"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSavedDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_saved_dto_1 = require("./create-saved.dto");
class UpdateSavedDto extends (0, swagger_1.PartialType)(create_saved_dto_1.CreateSavedDto) {
}
exports.UpdateSavedDto = UpdateSavedDto;
//# sourceMappingURL=update-saved.dto.js.map