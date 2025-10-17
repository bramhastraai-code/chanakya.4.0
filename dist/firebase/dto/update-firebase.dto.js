"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFirebaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_firebase_dto_1 = require("./create-firebase.dto");
class UpdateFirebaseDto extends (0, swagger_1.PartialType)(create_firebase_dto_1.CreateFirebaseDto) {
}
exports.UpdateFirebaseDto = UpdateFirebaseDto;
//# sourceMappingURL=update-firebase.dto.js.map