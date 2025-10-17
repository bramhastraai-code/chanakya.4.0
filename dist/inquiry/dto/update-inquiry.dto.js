"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBrokerInquiryDto = exports.UpdateInquiryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_inquiry_dto_1 = require("./create-inquiry.dto");
const create_agent_inquiry_dto_1 = require("./create-agent-inquiry.dto");
class UpdateInquiryDto extends (0, swagger_1.PartialType)(create_inquiry_dto_1.CreateInquiryDto) {
}
exports.UpdateInquiryDto = UpdateInquiryDto;
class UpdateBrokerInquiryDto extends (0, swagger_1.PartialType)(create_agent_inquiry_dto_1.CreateBrokerInquiryDto) {
}
exports.UpdateBrokerInquiryDto = UpdateBrokerInquiryDto;
//# sourceMappingURL=update-inquiry.dto.js.map