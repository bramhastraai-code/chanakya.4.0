"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShortVideoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_short_video_dto_1 = require("./create-short-video.dto");
class UpdateShortVideoDto extends (0, swagger_1.PartialType)(create_short_video_dto_1.CreateShortVideoDto) {
}
exports.UpdateShortVideoDto = UpdateShortVideoDto;
//# sourceMappingURL=update-short-video.dto.js.map