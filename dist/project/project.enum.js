"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectType = exports.ProjectStatus = void 0;
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["READY_TO_MOVE"] = "Ready to move";
    ProjectStatus["UNDER_CONSTRUCTION"] = "Under Construction";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectType;
(function (ProjectType) {
    ProjectType["NEW"] = "new";
    ProjectType["RENTAL"] = "rental";
    ProjectType["RESALE"] = "resale";
})(ProjectType || (exports.ProjectType = ProjectType = {}));
//# sourceMappingURL=project.enum.js.map