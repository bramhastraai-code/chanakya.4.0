"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoStatus = exports.VideoSourceType = void 0;
var VideoSourceType;
(function (VideoSourceType) {
    VideoSourceType["S3"] = "S3";
    VideoSourceType["YOUTUBE"] = "YOUTUBE";
})(VideoSourceType || (exports.VideoSourceType = VideoSourceType = {}));
var VideoStatus;
(function (VideoStatus) {
    VideoStatus["PENDING"] = "PENDING";
    VideoStatus["APPROVED"] = "APPROVED";
    VideoStatus["REJECTED"] = "REJECTED";
})(VideoStatus || (exports.VideoStatus = VideoStatus = {}));
//# sourceMappingURL=video.enum.js.map