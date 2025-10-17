"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAmenityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_amenity_dto_1 = require("./create-amenity.dto");
class UpdateAmenityDto extends (0, swagger_1.PartialType)(create_amenity_dto_1.CreateAmenityDto) {
}
exports.UpdateAmenityDto = UpdateAmenityDto;
//# sourceMappingURL=update-amenity.dto.js.map